<script lang="ts">
  import axios from "axios";
  import { onMount } from "svelte";
  import { Writable, get } from "svelte/store";

  import {
    API_SERVER,
    FLAG_NETWORK_STATUS,
    FLAG_CLIENT_STATUS,
  } from "./components/common/stores";

  export let params: any = {};

  class RTCPeerClient {
    constructor(
      _channelId: string,
      _onMessage: (msg: string) => void,
      _connectionStateFlag: Writable<boolean>
    ) {
      this.channelId = _channelId;
      this.connectionStateFlag = _connectionStateFlag;
      this.onMessage = _onMessage;
      this.initRTCConnection();
    }

    private channel: RTCDataChannel | null = null;
    private channelId: string;
    private connectionStateFlag: Writable<boolean>;
    private RTCConnection: RTCPeerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302",
          ],
        },
      ],
    });
    public isConnected: boolean = false;

    private onMessage: (msg: string) => void;
    private sendPing(): void {
      this.sendMessage("ping");
    }
    public sendMessage(msg: string): void {
      if (this.channel) this.channel.send(msg);
    }
    public initRTCConnection(callback: () => void = () => {}): void {
      this.channel = null;
      this.isConnected = false;
      this.connectionStateFlag.set(false);
      this.RTCConnection = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302",
              "stun:stun2.l.google.com:19302",
              "stun:stun3.l.google.com:19302",
              "stun:stun4.l.google.com:19302",
            ],
          },
        ],
      });
      this.RTCConnection.ondatachannel = (event) => {
        this.channel = event.channel;
        this.channel.onmessage = (event) => {
          if (event.data !== "ping") {
            this.onMessage(event.data);
          }
        };
      };
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
    }
    public resetRTCConnection(callback: () => void = () => {}): void {
      axios
        .get(
          `${window.location.toString().split("://")[0]}://${get(
            API_SERVER
          )}/.netlify/functions/resetConnection?channelId=${this.channelId}`
        )
        .then(() => {
          axios.post(
            `${window.location.toString().split("://")[0]}://${get(
              API_SERVER
            )}/.netlify/functions/connectionState`,
            JSON.stringify({
              channelId: this.channelId,
              state: "not_connected",
            })
          );
          this.initRTCConnection(callback);
        });
    }
    public async connectP2PSession(
      successCallback: () => void = () => {},
      failCallback: () => void = () => {}
    ): Promise<void> {
      console.log("start watch");
      let connectionFlag = false;
      const watchCreatedOfferInterval = setInterval(() => {
        axios
          .get(
            `${window.location.toString().split("://")[0]}://${get(
              API_SERVER
            )}/.netlify/functions/connectionState?channelId=${this.channelId}`
          )
          .then((res) => {
            const { connectionState } = res.data;
            console.log(connectionState);
            if (connectionState === "created_offer") {
              if (!connectionFlag) {
                connectionFlag = true;
                axios
                  .get(
                    `${window.location.toString().split("://")[0]}://${get(
                      API_SERVER
                    )}/.netlify/functions/offer?channelId=${this.channelId}`
                  )
                  .then(async (res) => {
                    const { offer } = res.data;
                    clearInterval(watchCreatedOfferInterval);
                    await this.RTCConnection.setRemoteDescription(
                      JSON.parse(offer)
                    ).then(async () => {
                      this.RTCConnection.onicecandidate = (event) => {
                        if (!event.candidate) {
                          axios
                            .post(
                              `${
                                window.location.toString().split("://")[0]
                              }://${get(API_SERVER)}/.netlify/functions/answer`,
                              JSON.stringify({
                                channelId: this.channelId,
                                answer: JSON.stringify(
                                  this.RTCConnection.localDescription
                                ),
                              })
                            )
                            .then(() => {
                              clearInterval(watchCreatedOfferInterval);
                            })
                            .then(successCallback);
                        }
                      };
                      const answer = await this.RTCConnection.createAnswer();
                      await this.RTCConnection.setLocalDescription(answer);
                    });
                  });
              }
            } else if (connectionState === "reset") {
              console.log("connnection reset");
              clearInterval(watchCreatedOfferInterval);
              clearInterval(connectionCheckInterval);
              this.resetRTCConnection();
              failCallback();
              this.connectP2PSession();
            }
          })
          .then(() => console.log("watch"));
      }, 1000);
      const connectionCheckInterval = setInterval(() => {
        console.log("ping test");
        try {
          this.sendPing();
          this.isConnected = true;
          this.connectionStateFlag.set(true);
        } catch (err) {
          if (this.isConnected) {
            clearInterval(watchCreatedOfferInterval);
            clearInterval(connectionCheckInterval);
            this.resetRTCConnection();
            this.connectP2PSession();
          }
        }
      }, 100);
    }
  }

  let rtcPeerClient: RTCPeerClient;

  onMount(() => {
    rtcPeerClient = new RTCPeerClient(
      params.channelId,
      (msg: string) => {
        console.log(`[${new Date().toISOString()}] ${msg}`);
      },
      FLAG_CLIENT_STATUS
    );
    rtcPeerClient.connectP2PSession(
      () => {
        console.log("successed connect to player!");
      },
      () => {
        console.log("failed connect to player...");
      }
    );
  });
</script>

<svelte:head
  ><style>
    html,
    body {
      background-color: transparent !important;
    }
  </style></svelte:head
>

<h1>channelId: {params.channelId}</h1>

<style lang="scss">
</style>
