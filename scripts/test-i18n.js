// Monodoxia Academy - i18n Verification Suite
import { getLocalized, getLocalizedArray } from '../src/i18n/localize.js';
import { AREAS } from '../src/data/mockData.js';
import translations from '../src/i18n/locales/index.js';

let failed = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  } else {
    console.log(`✓ PASS: ${message}`);
  }
}

console.log('--- 1. Testing AREAS 4-Language Completeness ---');
assert(AREAS.length === 8, `Expected 8 canonical areas, found ${AREAS.length}`);
['az', 'en', 'tr', 'ru'].forEach(lang => {
  AREAS.forEach((area, idx) => {
    const title = getLocalized(area, 'title', lang, 'az');
    const number = getLocalized(area, 'number', lang, 'az');
    assert(title && !title.startsWith('New Area') && !title.includes('???'), `Area #${idx+1} [${lang}] title is valid: "${title}"`);
    assert(number && !number.includes('/ PILLAR' && lang !== 'en') && !number.includes('???'), `Area #${idx+1} [${lang}] number is valid: "${number}"`);
  });
});

console.log('\n--- 2. Testing Club Tiers Fallback & Localizer ---');
const sampleTier = {
  id: 'custom-pro',
  name: 'Xüsusi Pro',
  desc: 'Azərbaycanca təsvir',
  features: ['Özəllik 1', 'Özəllik 2'],
  translations: {
    az: { name: 'Xüsusi Pro', desc: 'Azərbaycanca təsvir', features: ['Özəllik 1', 'Özəllik 2'] },
    en: { name: 'Custom Pro', desc: 'English description', features: ['Feature 1', 'Feature 2'] },
    tr: { name: 'Özel Pro', desc: 'Türkçe açıklama', features: ['Özellik 1', 'Özellik 2'] },
    ru: { name: 'Специальный Про', desc: 'Русское описание', features: ['Функция 1', 'Функция 2'] }
  }
};

['az', 'en', 'tr', 'ru'].forEach(lang => {
  const name = getLocalized(sampleTier, 'name', lang, 'az');
  const feats = getLocalizedArray(sampleTier, 'features', lang, 'az');
  assert(name === sampleTier.translations[lang].name, `sampleTier name in ${lang} matches`);
  assert(feats.length === 2 && feats[0] === sampleTier.translations[lang].features[0], `sampleTier features in ${lang} matches`);
});

console.log('\n--- 3. Testing Fallback on Missing Language ---');
const partialTier = {
  id: 'partial-tier',
  name: 'Yalnız AZ',
  translations: {
    az: { name: 'Yalnız AZ' }
  }
};
assert(getLocalized(partialTier, 'name', 'en', 'az') === 'Yalnız AZ', 'Fallback to AZ when EN translation missing');
assert(getLocalized(partialTier, 'name', 'ru', 'az') === 'Yalnız AZ', 'Fallback to AZ when RU translation missing');

console.log('\n--- 4. Testing Corrupted Character Prevention ---');
const corruptedTier = {
  id: 'corrupted',
  name: 'Clean Name',
  translations: {
    az: { name: 'Təmiz Ad' },
    ru: { name: 'VIP ???????' }
  }
};
assert(!getLocalized(corruptedTier, 'name', 'ru', 'az').includes('???'), 'Corrupted question marks are rejected in localized output');

console.log('\n--- 5. Testing Target Type & Profile Locales ---');
[
  'type_course', 'type_club', 'type_event', 'type_webinar', 'type_community',
  'profile_registered_label', 'submitted_form_responses', 'applicant_note_label',
  'profile_system_notifications', 'profile_learning_certs_coaching',
  'profile_earned_certificates', 'profile_booked_sessions', 'profile_coaching_reservations',
  'profile_membership_level_title', 'profile_current_status_label', 'profile_upgrade_plan_btn',
  'profile_member_label', 'profile_no_certs_title', 'profile_expert_certs_heading',
  'nav_club', 'nav_contact'
].forEach(key => {
  ['az', 'en', 'tr', 'ru'].forEach(lang => {
    assert(Boolean(translations[lang]?.[key]), `Key "${key}" exists in [${lang}]: "${translations[lang]?.[key]}"`);
  });
});

console.log('\n--- 6. Testing Navigation Club & Contact Translations ---');
assert(translations.en.nav_club === 'Wealth Club', `English nav_club is Wealth Club: "${translations.en.nav_club}"`);
assert(translations.tr.nav_club === 'Zenginler Kulübü', `Turkish nav_club is Zenginler Kulübü: "${translations.tr.nav_club}"`);
assert(translations.ru.nav_club === 'Клуб Богатых', `Russian nav_club is Клуб Богатых: "${translations.ru.nav_club}"`);
assert(translations.en.nav_contact === 'Contact', `English nav_contact is Contact`);
assert(translations.tr.nav_contact === 'İletişim', `Turkish nav_contact is İletişim`);
assert(translations.ru.nav_contact === 'Контакты', `Russian nav_contact is Контакты`);

if (failed > 0) {
  console.error(`\n❌ Total failures: ${failed}`);
  process.exit(1);
} else {
  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
}

