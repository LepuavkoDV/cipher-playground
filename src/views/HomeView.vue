<template>
  <body class="bg-gray-300 flex justify-center items-center h-screen">
  <div class="bg-white p-10 rounded-lg shadow-md">
    <h1 class="text-xl font-bold">Статус ЕСКО Агента</h1>
    <div class="mt-4 mb-10">
      <p v-if="cipher.isUCESAgentConnected" class="text-gray-600">Подключен</p>
      <p v-if="!cipher.isUCESAgentConnected" class="text-gray-600">Не подключен</p>
      <div class="bg-gray-400 w-64 h-3 rounded-lg mt-2 overflow-hidden">
        <div v-if="cipher.isUCESAgentConnected" class="bg-green-400 w-full h-full rounded-lg shadow-md"></div>
        <div v-if="!cipher.isUCESAgentConnected" class="bg-gray-400 w-full h-full rounded-lg shadow-md"></div>
      </div>
    </div>
    <template v-if="cipher.isUCESAgentConnected && cipher.isTokenConnected">
      <h3 class="text-sm camelcase">Подключенный токен:</h3>
      <div class="flex flex-col justify-start content-start text-left">
        <h2 class="tracking-wide text-xs">
          Модель: {{ cipher.connectedTokenInfo.model }}
        </h2>
        <h2 class="tracking-wide text-xs">
          Серийный номер: {{ cipher.connectedTokenInfo.serial }}
        </h2>
        <h2 class="tracking-wide text-xs">
          Имя: {{ cipher.connectedTokenInfo.name }}
        </h2>
        <h2 class="tracking-wide text-xs">
          Активный режим: {{ cipher.connectedTokenInfo.activeModePath }}
        </h2>
        <h2 class="tracking-wide text-xs">
          Пассивный режим: {{ cipher.connectedTokenInfo.passiveModePath }}
        </h2>
      </div>

      <div class="flex flex-col justify-start content-start text-left p-2 m-2">
        <button @click="login()">Создать сессию</button>
      </div>

      <div class="flex flex-col justify-start content-start text-left p-2 m-2">
        <label for="password"></label>
        <input class="p-2" name="password" type="password" v-model="keyStorePassword">
      </div>

      <div v-if="cipher.session.certificateLoaded" class="flex flex-col justify-start content-start text-left p-2 m-2">
        {{ cipher.ownerInfo.ownerFullName.value }}
      </div>
    </template>
  </div>
  </body>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCipher } from '@/store/cipher.module';

const keyStorePassword = ref('');

const cipher = useCipher();
cipher.checkUCESAgentStatus();

const login = async () => {
  await cipher.createSession();
  await cipher.setSessionOptions();
  await cipher.loadKeystoreContainer();
  await cipher.verifyKeystoreContainer(keyStorePassword.value);
};
</script>
