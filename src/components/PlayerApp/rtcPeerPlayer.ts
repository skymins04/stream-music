import axios from "axios";
import { Writable, get } from "svelte/store";
import { API_SERVER } from "../common/stores";

class RTCPeerPlayer {
  constructor(
    _channelId: string,
    _onMessage: (msg: string) => void,
    _connectionStateFlag: Writable<boolean>
  ) {
    this.channelId = _channelId;
    this.connectionStateFlag = _connectionStateFlag;
    this.onMessage = _onMessage;
  }

  private channel: RTCDataChannel | null = null;
  private channelId: string;
  private connectionStateFlag: Writable<boolean>;
  private RTCConnection: RTCPeerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });
  public isConnected: boolean = false;

  private onMessage: (msg: string) => void;
  private sendPing(): void {
    this.sendMessage("ping");
  }
  public sendMessage(msg: string): void {
    if (this.channel) this.channel.send(msg);
  }
  public resetRTCConnection(callback: () => void = () => {}): void {
    axios
      .get(
        `${window.location.toString().split("://")[0]}://${get(
          API_SERVER
        )}/.netlify/functions/resetConnection?channelId=${this.channelId}`
      )
      .then(() => {
        this.channel = null;
        this.isConnected = false;
        this.connectionStateFlag.set(false);
        this.RTCConnection = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        axios
          .post(
            `${window.location.toString().split("://")[0]}://${get(
              API_SERVER
            )}/.netlify/functions/connectionState`,
            JSON.stringify({
              channelId: this.channelId,
              state: "not_connected",
            })
          )
          .then(callback);
      });
  }
  public async connectP2PSession(
    successCallback: () => void = () => {},
    failCallback: () => void = () => {}
  ): Promise<void> {
    this.channel = this.RTCConnection.createDataChannel("stream-music");
    this.channel.onmessage = (event) => {
      if (event.data !== "ping") this.onMessage(event.data);
    };
    const connectionCheckInterval = setInterval(() => {
      try {
        this.sendPing();
        this.isConnected = true;
        this.connectionStateFlag.set(true);
      } catch (err) {
        if (this.isConnected) {
          clearInterval(connectionCheckInterval);
          this.resetRTCConnection();
        }
      }
    }, 100);
    this.RTCConnection.onicecandidate = async (event) => {
      if (!event.candidate) {
        axios
          .post(
            `${window.location.toString().split("://")[0]}://${get(
              API_SERVER
            )}/.netlify/functions/offer`,
            JSON.stringify({
              channelId: this.channelId,
              offer: JSON.stringify(this.RTCConnection.localDescription),
            })
          )
          .then(() => {
            const timer = new Date().getTime();
            const listenAnswerInterval = setInterval(() => {
              if (timer + 10000 < new Date().getTime()) {
                clearInterval(listenAnswerInterval);
                clearInterval(connectionCheckInterval);
                this.resetRTCConnection();
                failCallback();
                return;
              }
              axios
                .get(
                  `${window.location.toString().split("://")[0]}://${get(
                    API_SERVER
                  )}/.netlify/functions/answer?channelId=${this.channelId}`
                )
                .then(async (res) => {
                  const { answer, connectionState } = res.data;
                  if (answer !== "" && connectionState === "created_answer") {
                    clearInterval(listenAnswerInterval);
                    clearInterval(connectionCheckInterval);
                    await this.RTCConnection.setRemoteDescription(
                      JSON.parse(answer)
                    ).then(successCallback);
                  } else if (connectionState === "reset") {
                    clearInterval(listenAnswerInterval);
                    clearInterval(connectionCheckInterval);
                    this.resetRTCConnection();
                    failCallback();
                  }
                });
            }, 1000);
          });
      }
    };

    const offer = await this.RTCConnection.createOffer();
    await this.RTCConnection.setLocalDescription(offer);
  }
}

export { RTCPeerPlayer };
