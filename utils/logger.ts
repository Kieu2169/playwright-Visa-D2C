export const logger = {
  step(step: number, message: string) {
    console.log(`\n[STEP ${step}] ${message}`);
  },

  success(message: string) {
    console.log(`✅ ${message}`);
  },

  info(message: string) {
    console.log(`ℹ️ ${message}`);
  },

  warning(message: string) {
    console.warn(`⚠️ ${message}`);
  },

  error(message: string) {
    console.error(`❌ ${message}`);
  },

  section(title: string) {
    console.log('\n' + '='.repeat(80));
    console.log(title);
    console.log('='.repeat(80));
  },
};