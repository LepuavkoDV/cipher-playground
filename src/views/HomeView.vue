<template>
  <div class="home">
  </div>
</template>

<script setup lang="ts">
import { useCipher } from '@/store/cipher.module';

const cipher = useCipher();
cipher.checkUCESAgentStatus();
</script>
