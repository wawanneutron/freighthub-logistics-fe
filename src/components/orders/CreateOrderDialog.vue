<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '../../stores/orders';
import BaseInput from '../common/BaseInput.vue';
import BaseButton from '../common/BaseButton.vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'created'): void;
}>();

const orderStore = useOrderStore();
const { submitting, error } = storeToRefs(orderStore);

const form = ref({
  senderName: '',
  recipientName: '',
  origin: '',
  destination: '',
});

const formErrors = ref({
  senderName: '',
  recipientName: '',
  origin: '',
  destination: '',
});

const resetForm = () => {
  form.value = { senderName: '', recipientName: '', origin: '', destination: '' };
  formErrors.value = { senderName: '', recipientName: '', origin: '', destination: '' };
  orderStore.clearError();
};

watch(() => props.modelValue, (open) => {
  if (open) resetForm();
});

const close = () => {
  emit('update:modelValue', false);
};

const validate = () => {
  let isValid = true;
  formErrors.value = { senderName: '', recipientName: '', origin: '', destination: '' };

  if (!form.value.senderName.trim()) {
    formErrors.value.senderName = 'Sender Name is required';
    isValid = false;
  }
  if (!form.value.recipientName.trim()) {
    formErrors.value.recipientName = 'Recipient Name is required';
    isValid = false;
  }
  if (!form.value.origin.trim()) {
    formErrors.value.origin = 'Origin is required';
    isValid = false;
  }
  if (!form.value.destination.trim()) {
    formErrors.value.destination = 'Destination is required';
    isValid = false;
  }

  return isValid;
};

const submitForm = async () => {
  if (!validate()) return;

  orderStore.clearError();
  try {
    await orderStore.createOrder(form.value);
    close();
    emit('created');
  } catch (err) {
    console.error(err);
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="relative z-50" aria-labelledby="create-order-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="close"></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition
              enter-active-class="ease-out duration-200"
              enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to-class="opacity-100 translate-y-0 sm:scale-100"
              leave-active-class="ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0 sm:scale-100"
              leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div v-if="modelValue" class="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all w-full sm:my-8 sm:max-w-lg">
                <div class="flex items-center justify-between px-4 py-4 sm:px-6 border-b border-slate-200">
                  <div>
                    <h2 id="create-order-title" class="text-base font-semibold text-slate-900">Create New Order</h2>
                    <p class="mt-0.5 text-xs sm:text-sm text-slate-500 font-normal">Fill in the shipment details below.</p>
                  </div>
                  <button
                    @click="close"
                    class="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form @submit.prevent="submitForm">
                  <div class="px-4 py-5 sm:p-6 space-y-4">
                    <div v-if="error" class="bg-white rounded-lg border border-slate-200 p-3.5 flex gap-3 items-center">
                      <div class="w-1 h-5 bg-rose-500 rounded-full shrink-0"></div>
                      <p class="text-sm font-medium text-slate-700">{{ error }}</p>
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <BaseInput
                        v-model="form.senderName"
                        label="Sender Name"
                        required
                        :error="formErrors.senderName"
                        placeholder="e.g. John Doe"
                      />
                      <BaseInput
                        v-model="form.recipientName"
                        label="Recipient Name"
                        required
                        :error="formErrors.recipientName"
                        placeholder="e.g. Jane Doe"
                      />
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <BaseInput
                        v-model="form.origin"
                        label="Origin"
                        required
                        :error="formErrors.origin"
                        placeholder="e.g. Jakarta"
                      />
                      <BaseInput
                        v-model="form.destination"
                        label="Destination"
                        required
                        :error="formErrors.destination"
                        placeholder="e.g. Bandung"
                      />
                    </div>
                  </div>

                  <div class="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
                    <BaseButton variant="ghost" type="button" @click="close" :disabled="submitting">
                      Cancel
                    </BaseButton>
                    <BaseButton type="submit" :loading="submitting">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Create Order
                    </BaseButton>
                  </div>
                </form>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
