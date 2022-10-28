import { defineStore } from 'pinia';
import axios from 'axios';

export interface ITokenInfo {
  activeModePath: string;
  model: string;
  name: string;
  passiveModePath: string;
  serial: string;
}

export interface IConnectedDeviceInfo {
  passiveTokenPath: string[];
  activeTokenPath: string[];
  tokenInfo: ITokenInfo[];
}

export interface ICipherStoreState {
  updateUCESAgentStatusHandlerId: number | null;
  updateUCESAgentStatusInterval: number;
  isUCESAgentConnected: boolean;
  connectedToken: IConnectedDeviceInfo;
}

export const useCipher = defineStore('cipher', {
  state: (): ICipherStoreState => ({
    updateUCESAgentStatusHandlerId: null,
    updateUCESAgentStatusInterval: 2500,
    isUCESAgentConnected: false,
    connectedToken: {
      passiveTokenPath: [],
      activeTokenPath: [],
      tokenInfo: [],
    },
  }),
  getters: {
    isTokenConnected(): boolean {
      return this.connectedToken.tokenInfo.length > 0;
    },
    connectedTokenInfo(): ITokenInfo {
      return this.connectedToken.tokenInfo[0];
    },
  },
  actions: {
    async checkUCESAgentStatus() {
      this.setUCESAgentStatus(await this.getUCESAgentStatus());
      if (this.isUCESAgentConnected) {
        await this.getConnectedTokenInfo();
      }
      this.updateUCESAgentStatusHandlerId = setTimeout(
        this.checkUCESAgentStatus,
        this.updateUCESAgentStatusInterval,
      );
    },
    async getUCESAgentStatus() {
      try {
        await axios.get('https://local.cipher.kiev.ua:9090/api/v1/status');
        return true;
      } catch (error) {
        return false;
      }
    },
    setUCESAgentStatus(isConnected: boolean): void {
      this.isUCESAgentConnected = isConnected;
    },
    async getConnectedTokenInfo() {
      try {
        const { data } = await axios.get('https://local.cipher.kiev.ua:9090/api/v1/token/connected');
        this.connectedToken = data;
      } catch (error) {
        console.error(error);
      }
    },
  },
});
