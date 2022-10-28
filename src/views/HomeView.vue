<template>
  <body class="bg-gray-300 flex justify-center items-center h-screen">
  <div class="bg-white p-10 rounded-lg shadow-md">
    <h1 class="text-xl font-bold">Статус ЕСКО Агента</h1>
    <div class="mt-4 mb-10">
      <p v-if="cipher.isUCESAgentConnected" class="text-gray-600">Активен</p>
      <p v-if="!cipher.isUCESAgentConnected" class="text-gray-600">Не активен</p>
      <div class="bg-gray-400 w-64 h-3 rounded-lg mt-2 overflow-hidden">
        <div v-if="cipher.isUCESAgentConnected" class="bg-green-400 w-full h-full rounded-lg shadow-md"></div>
        <div v-if="!cipher.isUCESAgentConnected" class="bg-pink-400 w-full h-full rounded-lg shadow-md"></div>
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
    </template>
  </div>
  </body>
</template>

<script setup lang="ts">
import { useCipher } from '@/store/cipher.module';

const cipher = useCipher();
cipher.checkUCESAgentStatus();
</script>
