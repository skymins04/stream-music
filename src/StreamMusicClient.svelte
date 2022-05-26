<script lang="ts">
  import axios from "axios";
  import { Writable, get } from "svelte/store";

  import { API_SERVER } from "./components/common/stores";

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
    }
  }
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
