import { defineStore } from 'pinia';
import { api } from '@/api';

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

export interface ICertificateProperty {
  description: string;
  value: any;
}

export interface ICertificateInfo {
  keyAgreement: {
    canBeUsed: boolean;
    certificateInfo: {
      certificateSerialNumber: ICertificateProperty;
      extensionsCertificateInfo: {
        description: string;
        value: {
          alternativeOwnerName: ICertificateProperty;
          certificateProfile: ICertificateProperty;
          hashAlgorithmForEs: ICertificateProperty;
          isElectronicStamp: ICertificateProperty;
          isPrivateKeyOnQSCD: ICertificateProperty;
          isQualified: ICertificateProperty;
          isReinforced: ICertificateProperty;
          isTemporary: ICertificateProperty;
          issuerKeyId: ICertificateProperty;
          keyUsage: ICertificateProperty;
          personalData: ICertificateProperty;
          qscdTypeName: ICertificateProperty;
          subjectKeyId: ICertificateProperty;
          subjectOwnerId: ICertificateProperty;
        };
      };
      issuerCertificateInfo: ICertificateProperty;
      notAfter: any;
      notBefore: any;
      ownerCertificateInfo: any;
      publicKeyCertificateInfo: any;
    };
    message: string;
  };
  signature: any;
}

export interface ICipherStoreState {
  updateUCESAgentStatusHandlerId: number | null;
  updateUCESAgentStatusInterval: number;
  isUCESAgentConnected: boolean;
  connectedToken: IConnectedDeviceInfo;
  session: {
    ticketUuid: string;
    settedOptions: {
      caId: string;
    },
    certificateLoaded: boolean,
    certificateInfo: ICertificateInfo | null;
  }
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
    session: {
      ticketUuid: '',
      settedOptions: {
        caId: '',
      },
      certificateLoaded: false,
      certificateInfo: null,
    },
  }),
  getters: {
    isTokenConnected(): boolean {
      return this.connectedToken.tokenInfo.length > 0;
    },
    connectedTokenInfo(): ITokenInfo {
      return this.connectedToken.tokenInfo[0];
    },
    certificateInfo(): any {
      return this.session.certificateInfo;
    },
    ownerInfo(): any {
      return this.certificateInfo?.keyAgreement?.certificateInfo?.ownerCertificateInfo?.value;
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
        await api.getStatus();
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
        const { data } = await api.getConnectedToken();
        this.connectedToken = data;
      } catch (error) {
        console.error(error);
      }
    },
    async createSession() {
      try {
        const { data: { ticketUuid }} = await api.createSession();
        this.session.ticketUuid = ticketUuid;
      } catch (error) {
        console.error(error);
      }
    },
    async setSessionOptions() {
      try {
        const options = { caId: 'iddDfs' };
        const { data } = await api.setSessionOptions(this.session.ticketUuid, options);
        this.session.settedOptions.caId = data.settedOptions.caId;
      } catch (error) {
        console.error(error);
      }
    },
    async loadKeystoreContainer() {
      try {
        const options = { keyStorePath: this.connectedTokenInfo.activeModePath };
        await api.loadKeystoreContainer(this.session.ticketUuid, options);
      } catch (error) {
        console.error(error);
      }
    },
    async verifyKeystoreContainer(keyStorePassword: string) {
      try {
        const { data } = await api.verifyKeystoreContainer(this.session.ticketUuid, keyStorePassword);
        this.session.certificateLoaded = true;
        this.session.certificateInfo = data;
      } catch (error) {
        this.session.certificateLoaded = false;
        console.error(error);
      }
    },
  },
});
