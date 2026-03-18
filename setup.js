// setup.js — Configure Notion DB properties + seed 200 facilities
// Run: node setup.js

require('dotenv').config();

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

const headers = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Content-Type': 'application/json',
  'Notion-Version': '2022-06-28'
};

// ─── 1. Update DB schema ───────────────────────────────────────────────────────
async function setupDatabaseSchema() {
  console.log(' Setting up database schema...');

  const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      title: [{ type: 'text', text: { content: 'HealthNearby Facilities' } }],
      properties: {
        "City": {
          select: {
            options: [
              { name: 'Douala',     color: 'blue'   },
              { name: 'Yaoundé',    color: 'green'  },
              { name: 'Bafoussam', color: 'yellow' },
              { name: 'Bamenda',   color: 'pink'   },
              { name: 'Garoua',    color: 'orange' },
              { name: 'Maroua',    color: 'purple' }
            ]
          }
        },
        "Type": {
          select: {
            options: [
              { name: 'Pharmacy',      color: 'yellow' },
              { name: 'Hospital',      color: 'red'    },
              { name: 'Clinic',        color: 'pink'   },
              { name: 'Laboratory',    color: 'purple' },
              { name: 'Health center', color: 'orange' }
            ]
          }
        },
        "Neighborhood":        { rich_text: {}    },
        "Phone":               { phone_number: {} },
        "Is_Open_Now":         { checkbox: {}     },
        "Is_On_Duty":          { checkbox: {}     },
        "Accepts_MTN_MoMo":    { checkbox: {}     },
        "Accepts_Orange_Money":{ checkbox: {}     },
        "Weekdays_Hours":      { rich_text: {}    },
        "Saturday_Hours":      { rich_text: {}    },
        "Sunday_Hours":        { rich_text: {}    },
        "Reliability_Score":   { number: { format: 'number' } },
        "Last_Updated":        { date: {}         }
      }
    })
  });

  if (!res.ok) {
    const err = await res.json();
    console.error('Schema error:', JSON.stringify(err, null, 2));
    process.exit(1);
  }
  console.log('Schema configured');
}

// ─── 2. Facilities data (200 total) ───────────────────────────────────────────
const facilities = [

  // ══════════════════════════════════════════════════════
  // DOUALA (70 facilities)
  // ══════════════════════════════════════════════════════

  // Hospitals (8)
  { name: 'Hôpital Laquintinie',           city: 'Douala', neighborhood: 'Akwa',              type: 'Hospital',      phone: '+237 233 422 760', is_open: true,  is_on_duty: false, momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 95 },
  { name: 'Hôpital Saint Jean de Malte',   city: 'Douala', neighborhood: 'Logbessou',         type: 'Hospital',      phone: '+237 233 460 234', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 92 },
  { name: 'Hôpital Général de Douala',     city: 'Douala', neighborhood: 'Bonapriso',         type: 'Hospital',      phone: '+237 233 421 788', is_open: true,  is_on_duty: false, momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 97 },
  { name: 'Hôpital de District de Bonassama', city: 'Douala', neighborhood: 'Bonassama',      type: 'Hospital',      phone: '+237 233 470 111', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 80 },
  { name: 'Hôpital Nkongsamba',             city: 'Douala', neighborhood: 'Nkongsamba',       type: 'Hospital',      phone: '+237 233 491 200', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '07:00-18:00', saturday: '07:00-14:00', sunday: 'Closed',       reliability: 78 },
  { name: 'Polyclinique Bonamoussadi',      city: 'Douala', neighborhood: 'Bonamoussadi',     type: 'Hospital',      phone: '+237 233 435 678', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-20:00', saturday: '07:00-17:00', sunday: '09:00-14:00',  reliability: 88 },
  { name: 'Clinique Ngangué',               city: 'Douala', neighborhood: 'Ndokotti',         type: 'Hospital',      phone: '+237 233 408 500', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:30-20:00', saturday: '07:30-17:00', sunday: '09:00-13:00',  reliability: 86 },
  { name: 'Hôpital de District de Deido',  city: 'Douala', neighborhood: 'Deido',             type: 'Hospital',      phone: '+237 233 402 345', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 75 },

  // Clinics (12)
  { name: 'Clinique Bethesda',              city: 'Douala', neighborhood: 'Ndokotti',         type: 'Clinic',        phone: '+237 233 401 789', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-20:00', saturday: '08:00-18:00', sunday: '10:00-16:00',  reliability: 91 },
  { name: 'Clinique de la Cité',            city: 'Douala', neighborhood: 'Cité des Palmiers',type: 'Clinic',        phone: '+237 233 411 567', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '07:00-19:00', saturday: '07:00-15:00', sunday: 'Closed',       reliability: 82 },
  { name: 'Polyclinique Sainte Thérèse',    city: 'Douala', neighborhood: 'Bonabéri',         type: 'Clinic',        phone: '+237 233 415 321', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:30-20:00', saturday: '07:30-17:00', sunday: '09:00-14:00',  reliability: 86 },
  { name: 'Clinique Jouvence',              city: 'Douala', neighborhood: 'Makepe',           type: 'Clinic',        phone: '+237 233 440 789', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '08:00-20:00', saturday: '08:00-17:00', sunday: '10:00-14:00',  reliability: 83 },
  { name: 'Clinique la Providence',         city: 'Douala', neighborhood: 'Bonapriso',        type: 'Clinic',        phone: '+237 233 420 654', is_open: true,  is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-21:00', saturday: '07:00-19:00', sunday: '09:00-16:00',  reliability: 90 },
  { name: 'Clinique de Bali',               city: 'Douala', neighborhood: 'Bali',             type: 'Clinic',        phone: '+237 233 405 234', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-19:00', saturday: '08:00-15:00', sunday: 'Closed',       reliability: 79 },
  { name: 'Clinique Soins et Santé',        city: 'Douala', neighborhood: 'Akwa Nord',        type: 'Clinic',        phone: '+237 233 416 900', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '07:30-19:30', saturday: '07:30-15:00', sunday: 'Closed',       reliability: 77 },
  { name: 'Clinique Malachie',              city: 'Douala', neighborhood: 'Logbaba',          type: 'Clinic',        phone: '+237 233 449 123', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-20:00', saturday: '08:00-17:00', sunday: '10:00-14:00',  reliability: 84 },
  { name: 'Clinique Espérance',             city: 'Douala', neighborhood: 'Kotto',            type: 'Clinic',        phone: '+237 233 444 890', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '07:00-19:00', saturday: '07:00-14:00', sunday: 'Closed',       reliability: 80 },
  { name: 'Clinique Notre Dame',            city: 'Douala', neighborhood: 'Bonanjo',          type: 'Clinic',        phone: '+237 233 423 456', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:30-20:00', saturday: '07:30-17:00', sunday: '09:00-14:00',  reliability: 89 },
  { name: 'Clinique Lumière',               city: 'Douala', neighborhood: 'Ndog-Bong',        type: 'Clinic',        phone: '+237 233 461 234', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '08:00-18:00', saturday: '08:00-14:00', sunday: 'Closed',       reliability: 74 },
  { name: 'Clinique de Bonamoussadi',       city: 'Douala', neighborhood: 'Bonamoussadi',     type: 'Clinic',        phone: '+237 233 437 890', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-20:00', saturday: '07:00-16:00', sunday: '10:00-14:00',  reliability: 87 },

  // Pharmacies (30)
  { name: 'Pharmacie de Garde Nkongmondo',  city: 'Douala', neighborhood: 'Nkongmondo',       type: 'Pharmacy',      phone: '+237 233 408 899', is_open: true,  is_on_duty: true,  momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 96 },
  { name: 'Pharmacie Ndokoti Plus',         city: 'Douala', neighborhood: 'Ndokotti',         type: 'Pharmacy',      phone: '+237 233 409 123', is_open: true,  is_on_duty: true,  momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 94 },
  { name: 'Pharmacie Bonne Santé',          city: 'Douala', neighborhood: 'Deido',            type: 'Pharmacy',      phone: '+237 233 403 211', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-21:00', sunday: '10:00-18:00',  reliability: 93 },
  { name: 'Pharmacie Centrale',             city: 'Douala', neighborhood: 'Bonanjo',          type: 'Pharmacy',      phone: '+237 233 421 100', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-21:00', saturday: '08:00-21:00', sunday: 'Closed',       reliability: 87 },
  { name: 'Pharmacie de la Paix',           city: 'Douala', neighborhood: 'Makepe',           type: 'Pharmacy',      phone: '+237 233 439 456', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 84 },
  { name: 'Pharmacie du Wouri',             city: 'Douala', neighborhood: 'Akwa',             type: 'Pharmacy',      phone: '+237 233 426 789', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-21:00', sunday: '10:00-18:00',  reliability: 90 },
  { name: 'Pharmacie de Bépanda',           city: 'Douala', neighborhood: 'Bépanda',          type: 'Pharmacy',      phone: '+237 233 430 123', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 85 },
  { name: 'Pharmacie Akwa Plus',            city: 'Douala', neighborhood: 'Akwa',             type: 'Pharmacy',      phone: '+237 233 427 456', is_open: true,  is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-22:00', saturday: '08:00-22:00', sunday: '10:00-20:00',  reliability: 92 },
  { name: 'Pharmacie Bonamoussadi Centre',  city: 'Douala', neighborhood: 'Bonamoussadi',     type: 'Pharmacy',      phone: '+237 233 436 789', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-21:00', sunday: '10:00-18:00',  reliability: 88 },
  { name: 'Pharmacie de Bonapriso',         city: 'Douala', neighborhood: 'Bonapriso',        type: 'Pharmacy',      phone: '+237 233 421 567', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 89 },
  { name: 'Pharmacie Santa Barbara',        city: 'Douala', neighborhood: 'Bali',             type: 'Pharmacy',      phone: '+237 233 406 234', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '08:00-20:00', saturday: '08:00-19:00', sunday: '10:00-15:00',  reliability: 82 },
  { name: 'Pharmacie de la Cité',           city: 'Douala', neighborhood: 'Cité des Palmiers',type: 'Pharmacy',      phone: '+237 233 412 890', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 83 },
  { name: 'Pharmacie Bonabéri',             city: 'Douala', neighborhood: 'Bonabéri',         type: 'Pharmacy',      phone: '+237 233 416 123', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-21:00', sunday: '10:00-18:00',  reliability: 86 },
  { name: 'Pharmacie de la Victoire',       city: 'Douala', neighborhood: 'Logbessou',        type: 'Pharmacy',      phone: '+237 233 460 890', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 87 },
  { name: 'Pharmacie Makepe Missoke',       city: 'Douala', neighborhood: 'Makepe',           type: 'Pharmacy',      phone: '+237 233 441 234', is_open: true,  is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-22:00', saturday: '08:00-22:00', sunday: '10:00-20:00',  reliability: 91 },
  { name: 'Pharmacie du Port',              city: 'Douala', neighborhood: 'Bassa',            type: 'Pharmacy',      phone: '+237 233 453 456', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '08:00-18:00', saturday: '08:00-14:00', sunday: 'Closed',       reliability: 72 },
  { name: 'Pharmacie Kotto',                city: 'Douala', neighborhood: 'Kotto',            type: 'Pharmacy',      phone: '+237 233 445 678', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 80 },
  { name: 'Pharmacie Logbaba',              city: 'Douala', neighborhood: 'Logbaba',          type: 'Pharmacy',      phone: '+237 233 450 789', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-21:00', sunday: '10:00-18:00',  reliability: 85 },
  { name: 'Pharmacie Ndog-Bong',            city: 'Douala', neighborhood: 'Ndog-Bong',        type: 'Pharmacy',      phone: '+237 233 462 345', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '08:00-20:00', saturday: '08:00-18:00', sunday: '10:00-14:00',  reliability: 76 },
  { name: 'Pharmacie Mabanda',              city: 'Douala', neighborhood: 'Mabanda',          type: 'Pharmacy',      phone: '+237 233 471 234', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: 'Closed',       reliability: 78 },
  { name: 'Pharmacie de Garde Akwa',        city: 'Douala', neighborhood: 'Akwa',             type: 'Pharmacy',      phone: '+237 233 428 567', is_open: true,  is_on_duty: true,  momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 95 },
  { name: 'Pharmacie Cité des Palmiers',    city: 'Douala', neighborhood: 'Cité des Palmiers',type: 'Pharmacy',      phone: '+237 233 413 456', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 84 },
  { name: 'Pharmacie Bépanda Omnisports',   city: 'Douala', neighborhood: 'Bépanda',          type: 'Pharmacy',      phone: '+237 233 431 890', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-21:00', sunday: '10:00-18:00',  reliability: 87 },
  { name: 'Pharmacie Village',              city: 'Douala', neighborhood: 'Newtown',          type: 'Pharmacy',      phone: '+237 233 419 123', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '08:00-20:00', saturday: '08:00-18:00', sunday: 'Closed',       reliability: 73 },
  { name: 'Pharmacie Titi Garage',          city: 'Douala', neighborhood: 'Titi Garage',      type: 'Pharmacy',      phone: '+237 233 455 678', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 79 },
  { name: 'Pharmacie de Garde Bonanjo',     city: 'Douala', neighborhood: 'Bonanjo',          type: 'Pharmacy',      phone: '+237 233 422 234', is_open: false, is_on_duty: true,  momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 93 },
  { name: 'Pharmacie Melen Douala',         city: 'Douala', neighborhood: 'Melen',            type: 'Pharmacy',      phone: '+237 233 447 890', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-21:00', sunday: '10:00-18:00',  reliability: 86 },
  { name: 'Pharmacie Yassa',                city: 'Douala', neighborhood: 'Yassa',            type: 'Pharmacy',      phone: '+237 233 480 123', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 81 },
  { name: 'Pharmacie PK14',                 city: 'Douala', neighborhood: 'PK14',             type: 'Pharmacy',      phone: '+237 233 485 456', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '08:00-20:00', saturday: '08:00-18:00', sunday: 'Closed',       reliability: 77 },
  { name: 'Pharmacie Bessengue',            city: 'Douala', neighborhood: 'Bessengue',        type: 'Pharmacy',      phone: '+237 233 433 789', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-21:00', sunday: '10:00-18:00',  reliability: 88 },

  // Laboratories (10)
  { name: 'Laboratoire LANACOME',           city: 'Douala', neighborhood: 'Akwa',             type: 'Laboratory',    phone: '+237 233 427 654', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '07:00-18:00', saturday: '07:00-13:00', sunday: 'Closed',       reliability: 89 },
  { name: 'Laboratoire LABOGUI Douala',     city: 'Douala', neighborhood: 'Bonapriso',        type: 'Laboratory',    phone: '+237 233 418 900', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '07:00-17:00', saturday: '07:00-13:00', sunday: 'Closed',       reliability: 88 },
  { name: 'Laboratoire Ndokotti',           city: 'Douala', neighborhood: 'Ndokotti',         type: 'Laboratory',    phone: '+237 233 409 567', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-18:00', saturday: '07:00-13:00', sunday: 'Closed',       reliability: 86 },
  { name: 'Labo Analyse Bonamoussadi',      city: 'Douala', neighborhood: 'Bonamoussadi',     type: 'Laboratory',    phone: '+237 233 437 234', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '07:00-17:00', saturday: '07:00-12:00', sunday: 'Closed',       reliability: 84 },
  { name: 'Laboratoire de la Santé',        city: 'Douala', neighborhood: 'Makepe',           type: 'Laboratory',    phone: '+237 233 440 345', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '07:00-17:00', saturday: '07:00-13:00', sunday: 'Closed',       reliability: 82 },
  { name: 'Laboratoire Médical Deido',      city: 'Douala', neighborhood: 'Deido',            type: 'Laboratory',    phone: '+237 233 403 890', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-18:00', saturday: '07:00-13:00', sunday: 'Closed',       reliability: 85 },
  { name: 'Centre d\'Analyses Bali',        city: 'Douala', neighborhood: 'Bali',             type: 'Laboratory',    phone: '+237 233 407 123', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-16:30', saturday: '07:30-12:00', sunday: 'Closed',       reliability: 79 },
  { name: 'Labo BioMed Akwa',               city: 'Douala', neighborhood: 'Akwa',             type: 'Laboratory',    phone: '+237 233 428 900', is_open: true,  is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-19:00', saturday: '07:00-14:00', sunday: 'Closed',       reliability: 91 },
  { name: 'Laboratoire Kotto',              city: 'Douala', neighborhood: 'Kotto',            type: 'Laboratory',    phone: '+237 233 445 123', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '07:00-17:00', saturday: '07:00-12:00', sunday: 'Closed',       reliability: 80 },
  { name: 'Laboratoire Logbessou',          city: 'Douala', neighborhood: 'Logbessou',        type: 'Laboratory',    phone: '+237 233 461 789', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '07:00-17:00', saturday: '07:00-13:00', sunday: 'Closed',       reliability: 77 },

  // Health centers (10)
  { name: 'CSI de Bépanda',                 city: 'Douala', neighborhood: 'Bépanda',          type: 'Health center', phone: '+237 233 401 122', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 88 },
  { name: 'Centre Médical Kotto',           city: 'Douala', neighborhood: 'Kotto',            type: 'Health center', phone: '+237 233 444 567', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-12:00', sunday: 'Closed',       reliability: 79 },
  { name: 'CSI Ndogpassi',                  city: 'Douala', neighborhood: 'Ndogpassi',        type: 'Health center', phone: '+237 233 452 234', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 76 },
  { name: 'Centre de Santé Bonabéri',       city: 'Douala', neighborhood: 'Bonabéri',         type: 'Health center', phone: '+237 233 417 456', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 74 },
  { name: 'CSI Makepe',                     city: 'Douala', neighborhood: 'Makepe',           type: 'Health center', phone: '+237 233 441 890', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 78 },
  { name: 'Centre de Santé Bonanjo',        city: 'Douala', neighborhood: 'Bonanjo',          type: 'Health center', phone: '+237 233 423 789', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-12:00', sunday: 'Closed',       reliability: 73 },
  { name: 'CSI Logbaba',                    city: 'Douala', neighborhood: 'Logbaba',          type: 'Health center', phone: '+237 233 451 345', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 75 },
  { name: 'Centre de Santé Ndog-Bong',      city: 'Douala', neighborhood: 'Ndog-Bong',        type: 'Health center', phone: '+237 233 463 456', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 72 },
  { name: 'CSI Deido',                      city: 'Douala', neighborhood: 'Deido',            type: 'Health center', phone: '+237 233 404 567', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 77 },
  { name: 'Centre de Santé Yassa',          city: 'Douala', neighborhood: 'Yassa',            type: 'Health center', phone: '+237 233 481 678', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 71 },

  // ══════════════════════════════════════════════════════
  // YAOUNDÉ (50 facilities)
  // ══════════════════════════════════════════════════════

  // Hospitals (6)
  { name: 'Hôpital Central de Yaoundé',     city: 'Yaoundé', neighborhood: 'Centre Ville',   type: 'Hospital',      phone: '+237 222 230 012', is_open: true,  is_on_duty: false, momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 97 },
  { name: 'Hôpital Général de Yaoundé',     city: 'Yaoundé', neighborhood: 'Ekounou',        type: 'Hospital',      phone: '+237 222 204 567', is_open: true,  is_on_duty: false, momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 95 },
  { name: 'Hôpital de District de Biyem-Assi', city: 'Yaoundé', neighborhood: 'Biyem-Assi', type: 'Hospital',      phone: '+237 222 310 234', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 82 },
  { name: 'Hôpital de District de Cité Verte', city: 'Yaoundé', neighborhood: 'Cité Verte', type: 'Hospital',      phone: '+237 222 225 678', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 79 },
  { name: 'Polyclinique de Yaoundé',         city: 'Yaoundé', neighborhood: 'Mvog-Ada',      type: 'Hospital',      phone: '+237 222 212 345', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-20:00', saturday: '07:00-17:00', sunday: '09:00-14:00',  reliability: 88 },
  { name: 'Hôpital Saint Martin de Porres', city: 'Yaoundé', neighborhood: 'Messa',          type: 'Hospital',      phone: '+237 222 218 901', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-20:00', saturday: '07:00-17:00', sunday: '09:00-13:00',  reliability: 86 },

  // Clinics (10)
  { name: 'Clinique de la Cathédrale',      city: 'Yaoundé', neighborhood: 'Centre Ville',   type: 'Clinic',        phone: '+237 222 223 456', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:30-20:00', saturday: '07:30-17:00', sunday: '09:00-14:00',  reliability: 90 },
  { name: 'Clinique Bethel',                city: 'Yaoundé', neighborhood: 'Bastos',          type: 'Clinic',        phone: '+237 222 202 789', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-20:00', saturday: '08:00-18:00', sunday: '10:00-15:00',  reliability: 89 },
  { name: 'Clinique la Grâce',              city: 'Yaoundé', neighborhood: 'Nlongkak',        type: 'Clinic',        phone: '+237 222 219 567', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '07:30-19:30', saturday: '07:30-16:00', sunday: 'Closed',       reliability: 84 },
  { name: 'Clinique Sainte-Claire',         city: 'Yaoundé', neighborhood: 'Melen',          type: 'Clinic',        phone: '+237 222 220 234', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '08:00-20:00', saturday: '08:00-17:00', sunday: '10:00-14:00',  reliability: 82 },
  { name: 'Clinique de Biyem-Assi',         city: 'Yaoundé', neighborhood: 'Biyem-Assi',     type: 'Clinic',        phone: '+237 222 311 456', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '07:00-19:00', saturday: '07:00-15:00', sunday: 'Closed',       reliability: 81 },
  { name: 'Clinique du Plateau',            city: 'Yaoundé', neighborhood: 'Plateau',        type: 'Clinic',        phone: '+237 222 227 890', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:30-20:00', saturday: '07:30-17:00', sunday: '09:00-14:00',  reliability: 87 },
  { name: 'Clinique Elig-Edzoa',            city: 'Yaoundé', neighborhood: 'Elig-Edzoa',     type: 'Clinic',        phone: '+237 222 215 678', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '08:00-18:00', saturday: '08:00-14:00', sunday: 'Closed',       reliability: 76 },
  { name: 'Clinique Mvog-Ada',              city: 'Yaoundé', neighborhood: 'Mvog-Ada',       type: 'Clinic',        phone: '+237 222 213 234', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-20:00', saturday: '07:00-16:00', sunday: '10:00-14:00',  reliability: 85 },
  { name: 'Clinique Kondengui',             city: 'Yaoundé', neighborhood: 'Kondengui',      type: 'Clinic',        phone: '+237 222 239 123', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '07:30-19:30', saturday: '07:30-15:00', sunday: 'Closed',       reliability: 80 },
  { name: 'Clinique Messa',                 city: 'Yaoundé', neighborhood: 'Messa',          type: 'Clinic',        phone: '+237 222 218 456', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '08:00-19:00', saturday: '08:00-15:00', sunday: 'Closed',       reliability: 78 },

  // Pharmacies (22)
  { name: 'Pharmacie du Rond-Point',        city: 'Yaoundé', neighborhood: 'Bastos',         type: 'Pharmacy',      phone: '+237 222 201 456', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-21:00', sunday: '10:00-18:00',  reliability: 90 },
  { name: 'Pharmacie Nationale de Yaoundé', city: 'Yaoundé', neighborhood: 'Melen',         type: 'Pharmacy',      phone: '+237 222 219 890', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-21:00', saturday: '08:00-21:00', sunday: '10:00-18:00',  reliability: 88 },
  { name: 'Pharmacie de Garde Bastos',      city: 'Yaoundé', neighborhood: 'Bastos',         type: 'Pharmacy',      phone: '+237 222 201 789', is_open: true,  is_on_duty: true,  momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 96 },
  { name: 'Pharmacie Centre Ville',         city: 'Yaoundé', neighborhood: 'Centre Ville',   type: 'Pharmacy',      phone: '+237 222 222 345', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 87 },
  { name: 'Pharmacie Omnisports',           city: 'Yaoundé', neighborhood: 'Omnisports',     type: 'Pharmacy',      phone: '+237 222 228 567', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-21:00', sunday: '10:00-18:00',  reliability: 89 },
  { name: 'Pharmacie de Nlongkak',          city: 'Yaoundé', neighborhood: 'Nlongkak',       type: 'Pharmacy',      phone: '+237 222 220 678', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 83 },
  { name: 'Pharmacie Mvog-Mbi',             city: 'Yaoundé', neighborhood: 'Mvog-Mbi',       type: 'Pharmacy',      phone: '+237 222 233 234', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 82 },
  { name: 'Pharmacie Elig-Essono',          city: 'Yaoundé', neighborhood: 'Elig-Essono',    type: 'Pharmacy',      phone: '+237 222 208 901', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-21:00', sunday: '10:00-18:00',  reliability: 86 },
  { name: 'Pharmacie Biyem-Assi Centre',    city: 'Yaoundé', neighborhood: 'Biyem-Assi',     type: 'Pharmacy',      phone: '+237 222 312 456', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 85 },
  { name: 'Pharmacie de Garde Melen',       city: 'Yaoundé', neighborhood: 'Melen',          type: 'Pharmacy',      phone: '+237 222 220 567', is_open: false, is_on_duty: true,  momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 94 },
  { name: 'Pharmacie Mvog-Ada',             city: 'Yaoundé', neighborhood: 'Mvog-Ada',       type: 'Pharmacy',      phone: '+237 222 213 678', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 81 },
  { name: 'Pharmacie Efoulan',              city: 'Yaoundé', neighborhood: 'Efoulan',        type: 'Pharmacy',      phone: '+237 222 235 890', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '08:00-20:00', saturday: '08:00-18:00', sunday: 'Closed',       reliability: 77 },
  { name: 'Pharmacie Ekounou',              city: 'Yaoundé', neighborhood: 'Ekounou',        type: 'Pharmacy',      phone: '+237 222 206 234', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-21:00', sunday: '10:00-18:00',  reliability: 84 },
  { name: 'Pharmacie Messa',                city: 'Yaoundé', neighborhood: 'Messa',          type: 'Pharmacy',      phone: '+237 222 218 234', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 80 },
  { name: 'Pharmacie Tsinga',               city: 'Yaoundé', neighborhood: 'Tsinga',         type: 'Pharmacy',      phone: '+237 222 226 567', is_open: true,  is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-22:00', saturday: '08:00-22:00', sunday: '10:00-20:00',  reliability: 91 },
  { name: 'Pharmacie Mendong',              city: 'Yaoundé', neighborhood: 'Mendong',        type: 'Pharmacy',      phone: '+237 222 319 890', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '08:00-20:00', saturday: '08:00-18:00', sunday: 'Closed',       reliability: 76 },
  { name: 'Pharmacie Mvog-Betsi',           city: 'Yaoundé', neighborhood: 'Mvog-Betsi',     type: 'Pharmacy',      phone: '+237 222 241 234', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 79 },
  { name: 'Pharmacie Nkoldongo',            city: 'Yaoundé', neighborhood: 'Nkoldongo',      type: 'Pharmacy',      phone: '+237 222 245 678', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-21:00', sunday: '10:00-18:00',  reliability: 83 },
  { name: 'Pharmacie Etoug-Ebe',            city: 'Yaoundé', neighborhood: 'Etoug-Ebe',      type: 'Pharmacy',      phone: '+237 222 315 234', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '08:00-20:00', saturday: '08:00-18:00', sunday: 'Closed',       reliability: 74 },
  { name: 'Pharmacie Oyom-Abang',           city: 'Yaoundé', neighborhood: 'Oyom-Abang',     type: 'Pharmacy',      phone: '+237 222 247 890', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 78 },
  { name: 'Pharmacie Nsimeyong',            city: 'Yaoundé', neighborhood: 'Nsimeyong',      type: 'Pharmacy',      phone: '+237 222 237 456', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-21:00', sunday: '10:00-18:00',  reliability: 85 },
  { name: 'Pharmacie Elig-Effa',            city: 'Yaoundé', neighborhood: 'Elig-Effa',      type: 'Pharmacy',      phone: '+237 222 210 678', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 82 },

  // Laboratories (6)
  { name: 'Laboratoire LABOGUI Yaoundé',    city: 'Yaoundé', neighborhood: 'Centre',         type: 'Laboratory',    phone: '+237 222 231 678', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '07:00-18:00', saturday: '07:00-13:00', sunday: 'Closed',       reliability: 91 },
  { name: 'Laboratoire Bastos',             city: 'Yaoundé', neighborhood: 'Bastos',         type: 'Laboratory',    phone: '+237 222 203 456', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-18:00', saturday: '07:00-13:00', sunday: 'Closed',       reliability: 90 },
  { name: 'Labo Analyse Centre',            city: 'Yaoundé', neighborhood: 'Centre Ville',   type: 'Laboratory',    phone: '+237 222 224 789', is_open: true,  is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-19:00', saturday: '07:00-14:00', sunday: 'Closed',       reliability: 92 },
  { name: 'Laboratoire Nlongkak',           city: 'Yaoundé', neighborhood: 'Nlongkak',       type: 'Laboratory',    phone: '+237 222 221 234', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '07:00-17:00', saturday: '07:00-13:00', sunday: 'Closed',       reliability: 85 },
  { name: 'BioLab Biyem-Assi',              city: 'Yaoundé', neighborhood: 'Biyem-Assi',     type: 'Laboratory',    phone: '+237 222 313 567', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '07:00-17:00', saturday: '07:00-12:00', sunday: 'Closed',       reliability: 83 },
  { name: 'Laboratoire Ekounou',            city: 'Yaoundé', neighborhood: 'Ekounou',        type: 'Laboratory',    phone: '+237 222 207 890', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-16:30', saturday: '07:30-12:00', sunday: 'Closed',       reliability: 78 },

  // Health centers (6)
  { name: 'CSI de Nkolbisson',              city: 'Yaoundé', neighborhood: 'Nkolbisson',     type: 'Health center', phone: '+237 222 314 567', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 85 },
  { name: 'Centre de Santé de Messa',       city: 'Yaoundé', neighborhood: 'Messa',          type: 'Health center', phone: '+237 222 217 345', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 80 },
  { name: 'CSI Biyem-Assi',                 city: 'Yaoundé', neighborhood: 'Biyem-Assi',     type: 'Health center', phone: '+237 222 312 890', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 77 },
  { name: 'Centre de Santé Ekounou',        city: 'Yaoundé', neighborhood: 'Ekounou',        type: 'Health center', phone: '+237 222 205 678', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 74 },
  { name: 'CSI Mendong',                    city: 'Yaoundé', neighborhood: 'Mendong',        type: 'Health center', phone: '+237 222 318 234', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-12:00', sunday: 'Closed',       reliability: 72 },
  { name: 'Centre de Santé Nlongkak',       city: 'Yaoundé', neighborhood: 'Nlongkak',       type: 'Health center', phone: '+237 222 220 901', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 76 },

  // ══════════════════════════════════════════════════════
  // BAFOUSSAM (25 facilities)
  // ══════════════════════════════════════════════════════
  { name: 'Hôpital Régional de Bafoussam',  city: 'Bafoussam', neighborhood: 'Centre',      type: 'Hospital',      phone: '+237 233 441 001', is_open: true,  is_on_duty: false, momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 93 },
  { name: 'Hôpital de District Bafoussam',  city: 'Bafoussam', neighborhood: 'Tougang',     type: 'Hospital',      phone: '+237 233 441 234', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 79 },
  { name: 'Clinique la Vie',                city: 'Bafoussam', neighborhood: 'Djeleng',     type: 'Clinic',        phone: '+237 233 442 567', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-20:00', saturday: '07:00-17:00', sunday: '09:00-14:00',  reliability: 87 },
  { name: 'Clinique de la Paix',            city: 'Bafoussam', neighborhood: 'Banengo',     type: 'Clinic',        phone: '+237 233 443 890', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-19:00', saturday: '08:00-15:00', sunday: 'Closed',       reliability: 81 },
  { name: 'Clinique Sainte Anne',           city: 'Bafoussam', neighborhood: 'Kamkop',      type: 'Clinic',        phone: '+237 233 444 234', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '07:30-19:30', saturday: '07:30-15:00', sunday: 'Closed',       reliability: 78 },
  { name: 'Pharmacie de Garde Bafoussam',   city: 'Bafoussam', neighborhood: 'Centre',      type: 'Pharmacy',      phone: '+237 233 445 001', is_open: true,  is_on_duty: true,  momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 95 },
  { name: 'Pharmacie de la Paix',           city: 'Bafoussam', neighborhood: 'Centre',      type: 'Pharmacy',      phone: '+237 233 445 678', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 88 },
  { name: 'Pharmacie Tougang',              city: 'Bafoussam', neighborhood: 'Tougang',     type: 'Pharmacy',      phone: '+237 233 446 234', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 84 },
  { name: 'Pharmacie Djeleng',              city: 'Bafoussam', neighborhood: 'Djeleng',     type: 'Pharmacy',      phone: '+237 233 446 789', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '08:00-20:00', saturday: '08:00-18:00', sunday: 'Closed',       reliability: 80 },
  { name: 'Pharmacie Marché A',             city: 'Bafoussam', neighborhood: 'Marché A',    type: 'Pharmacy',      phone: '+237 233 447 345', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-21:00', sunday: '10:00-18:00',  reliability: 86 },
  { name: 'Pharmacie Kamkop',               city: 'Bafoussam', neighborhood: 'Kamkop',      type: 'Pharmacy',      phone: '+237 233 447 890', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-20:00', saturday: '08:00-18:00', sunday: 'Closed',       reliability: 79 },
  { name: 'Pharmacie Banengo',              city: 'Bafoussam', neighborhood: 'Banengo',     type: 'Pharmacy',      phone: '+237 233 448 456', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '08:00-20:00', saturday: '08:00-18:00', sunday: 'Closed',       reliability: 77 },
  { name: 'Pharmacie Kouonou',              city: 'Bafoussam', neighborhood: 'Kouonou',     type: 'Pharmacy',      phone: '+237 233 449 012', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 83 },
  { name: 'Pharmacie Tamdja',               city: 'Bafoussam', neighborhood: 'Tamdja',      type: 'Pharmacy',      phone: '+237 233 449 567', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-20:00', saturday: '08:00-18:00', sunday: 'Closed',       reliability: 78 },
  { name: 'Pharmacie Famla',                city: 'Bafoussam', neighborhood: 'Famla',       type: 'Pharmacy',      phone: '+237 233 450 123', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '08:00-20:00', saturday: '08:00-16:00', sunday: 'Closed',       reliability: 73 },
  { name: 'Laboratoire Bafoussam Centre',   city: 'Bafoussam', neighborhood: 'Centre',      type: 'Laboratory',    phone: '+237 233 441 456', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-17:00', saturday: '07:00-13:00', sunday: 'Closed',       reliability: 87 },
  { name: 'Laboratoire Tougang',            city: 'Bafoussam', neighborhood: 'Tougang',     type: 'Laboratory',    phone: '+237 233 442 012', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '07:00-16:00', saturday: '07:00-12:00', sunday: 'Closed',       reliability: 82 },
  { name: 'Labo BioAnalyse',                city: 'Bafoussam', neighborhood: 'Djeleng',     type: 'Laboratory',    phone: '+237 233 443 123', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '07:00-17:00', saturday: '07:00-13:00', sunday: 'Closed',       reliability: 80 },
  { name: 'CSI de Tougang',                 city: 'Bafoussam', neighborhood: 'Tougang',     type: 'Health center', phone: '+237 233 441 789', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 77 },
  { name: 'CSI de Djeleng',                 city: 'Bafoussam', neighborhood: 'Djeleng',     type: 'Health center', phone: '+237 233 442 345', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 74 },
  { name: 'Centre de Santé Banengo',        city: 'Bafoussam', neighborhood: 'Banengo',     type: 'Health center', phone: '+237 233 443 456', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-12:00', sunday: 'Closed',       reliability: 72 },
  { name: 'CSI Kamkop',                     city: 'Bafoussam', neighborhood: 'Kamkop',      type: 'Health center', phone: '+237 233 444 567', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 71 },
  { name: 'Clinique Koptchou',              city: 'Bafoussam', neighborhood: 'Koptchou',    type: 'Clinic',        phone: '+237 233 450 456', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-19:00', saturday: '07:00-15:00', sunday: 'Closed',       reliability: 83 },
  { name: 'Pharmacie Koptchou',             city: 'Bafoussam', neighborhood: 'Koptchou',    type: 'Pharmacy',      phone: '+237 233 450 789', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 81 },
  { name: 'Pharmacie de Garde Tougang',     city: 'Bafoussam', neighborhood: 'Tougang',     type: 'Pharmacy',      phone: '+237 233 441 012', is_open: false, is_on_duty: true,  momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 92 },

  // ══════════════════════════════════════════════════════
  // BAMENDA (25 facilities)
  // ══════════════════════════════════════════════════════
  { name: 'Hôpital Régional de Bamenda',    city: 'Bamenda', neighborhood: 'Up Station',    type: 'Hospital',      phone: '+237 233 361 001', is_open: true,  is_on_duty: false, momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 92 },
  { name: 'Baptist Hospital Bamenda',       city: 'Bamenda', neighborhood: 'Mile 4 Nkwen',  type: 'Hospital',      phone: '+237 233 362 234', is_open: true,  is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-20:00', saturday: '07:00-18:00', sunday: '09:00-15:00',  reliability: 96 },
  { name: 'Hôpital de District Bamenda',    city: 'Bamenda', neighborhood: 'Commercial Ave',type: 'Hospital',      phone: '+237 233 363 567', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 78 },
  { name: 'Clinique de la Colline',         city: 'Bamenda', neighborhood: 'Up Station',    type: 'Clinic',        phone: '+237 233 364 890', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-20:00', saturday: '07:00-17:00', sunday: '09:00-14:00',  reliability: 88 },
  { name: 'Clinique Sainte Marie',          city: 'Bamenda', neighborhood: 'Old Town',      type: 'Clinic',        phone: '+237 233 365 234', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-19:00', saturday: '08:00-15:00', sunday: 'Closed',       reliability: 82 },
  { name: 'Pharmacie de Garde Up Station',  city: 'Bamenda', neighborhood: 'Up Station',    type: 'Pharmacy',      phone: '+237 233 361 500', is_open: true,  is_on_duty: true,  momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 94 },
  { name: 'Pharmacie Commercial Avenue',    city: 'Bamenda', neighborhood: 'Commercial Ave',type: 'Pharmacy',      phone: '+237 233 363 234', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-21:00', sunday: '10:00-18:00',  reliability: 89 },
  { name: 'Pharmacie Nkwen',               city: 'Bamenda', neighborhood: 'Nkwen',          type: 'Pharmacy',      phone: '+237 233 366 567', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 85 },
  { name: 'Pharmacie Old Town',             city: 'Bamenda', neighborhood: 'Old Town',      type: 'Pharmacy',      phone: '+237 233 366 012', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '08:00-20:00', saturday: '08:00-18:00', sunday: 'Closed',       reliability: 81 },
  { name: 'Pharmacie Cow Street',           city: 'Bamenda', neighborhood: 'Cow Street',    type: 'Pharmacy',      phone: '+237 233 367 456', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 83 },
  { name: 'Pharmacie Azire',                city: 'Bamenda', neighborhood: 'Azire',         type: 'Pharmacy',      phone: '+237 233 368 789', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-20:00', saturday: '08:00-18:00', sunday: 'Closed',       reliability: 78 },
  { name: 'Pharmacie Mulang',               city: 'Bamenda', neighborhood: 'Mulang',        type: 'Pharmacy',      phone: '+237 233 369 234', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '08:00-20:00', saturday: '08:00-16:00', sunday: 'Closed',       reliability: 74 },
  { name: 'Pharmacie Mile 4',               city: 'Bamenda', neighborhood: 'Mile 4 Nkwen',  type: 'Pharmacy',      phone: '+237 233 362 678', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-21:00', sunday: '10:00-18:00',  reliability: 87 },
  { name: 'Pharmacie Nkwen Market',         city: 'Bamenda', neighborhood: 'Nkwen',         type: 'Pharmacy',      phone: '+237 233 366 901', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 84 },
  { name: 'Pharmacie de Garde Mile 4',      city: 'Bamenda', neighborhood: 'Mile 4 Nkwen',  type: 'Pharmacy',      phone: '+237 233 362 012', is_open: false, is_on_duty: true,  momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 91 },
  { name: 'Pharmacie Ntarikon',             city: 'Bamenda', neighborhood: 'Ntarikon',      type: 'Pharmacy',      phone: '+237 233 370 345', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 80 },
  { name: 'Laboratoire Bamenda Centre',     city: 'Bamenda', neighborhood: 'Commercial Ave',type: 'Laboratory',    phone: '+237 233 363 890', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-17:00', saturday: '07:00-13:00', sunday: 'Closed',       reliability: 86 },
  { name: 'Laboratoire Up Station',         city: 'Bamenda', neighborhood: 'Up Station',    type: 'Laboratory',    phone: '+237 233 361 678', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '07:00-18:00', saturday: '07:00-13:00', sunday: 'Closed',       reliability: 88 },
  { name: 'BioLab Nkwen',                   city: 'Bamenda', neighborhood: 'Nkwen',         type: 'Laboratory',    phone: '+237 233 366 234', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '07:00-16:00', saturday: '07:00-12:00', sunday: 'Closed',       reliability: 81 },
  { name: 'CSI de Cow Street',              city: 'Bamenda', neighborhood: 'Cow Street',    type: 'Health center', phone: '+237 233 367 012', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 76 },
  { name: 'Centre de Santé Azire',          city: 'Bamenda', neighborhood: 'Azire',         type: 'Health center', phone: '+237 233 368 234', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-12:00', sunday: 'Closed',       reliability: 73 },
  { name: 'CSI Old Town',                   city: 'Bamenda', neighborhood: 'Old Town',      type: 'Health center', phone: '+237 233 366 345', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 75 },
  { name: 'Clinique Ntarikon',              city: 'Bamenda', neighborhood: 'Ntarikon',      type: 'Clinic',        phone: '+237 233 370 678', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '07:00-19:00', saturday: '07:00-15:00', sunday: 'Closed',       reliability: 80 },
  { name: 'Clinique Mulang',                city: 'Bamenda', neighborhood: 'Mulang',        type: 'Clinic',        phone: '+237 233 369 567', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '08:00-18:00', saturday: '08:00-14:00', sunday: 'Closed',       reliability: 77 },
  { name: 'Pharmacie Foncha Street',        city: 'Bamenda', neighborhood: 'Foncha Street', type: 'Pharmacy',      phone: '+237 233 371 234', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-21:00', saturday: '08:00-21:00', sunday: '10:00-18:00',  reliability: 86 },

  // ══════════════════════════════════════════════════════
  // GAROUA (15 facilities)
  // ══════════════════════════════════════════════════════
  { name: 'Hôpital Régional de Garoua',     city: 'Garoua', neighborhood: 'Centre',         type: 'Hospital',      phone: '+237 222 271 001', is_open: true,  is_on_duty: false, momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 91 },
  { name: 'Hôpital de District de Garoua',  city: 'Garoua', neighborhood: 'Lopéré',         type: 'Hospital',      phone: '+237 222 272 234', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 77 },
  { name: 'Clinique Lamiido',               city: 'Garoua', neighborhood: 'Lamiido',        type: 'Clinic',        phone: '+237 222 273 567', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-19:00', saturday: '07:00-16:00', sunday: '09:00-14:00',  reliability: 85 },
  { name: 'Clinique El Hadj',               city: 'Garoua', neighborhood: 'Bocklé',         type: 'Clinic',        phone: '+237 222 274 890', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-18:00', saturday: '08:00-14:00', sunday: 'Closed',       reliability: 79 },
  { name: 'Pharmacie de Garde Garoua',      city: 'Garoua', neighborhood: 'Centre',         type: 'Pharmacy',      phone: '+237 222 271 500', is_open: true,  is_on_duty: true,  momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 93 },
  { name: 'Pharmacie du Marché',            city: 'Garoua', neighborhood: 'Grand Marché',   type: 'Pharmacy',      phone: '+237 222 275 234', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-20:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 86 },
  { name: 'Pharmacie Lopéré',               city: 'Garoua', neighborhood: 'Lopéré',         type: 'Pharmacy',      phone: '+237 222 272 678', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-20:00', saturday: '08:00-18:00', sunday: 'Closed',       reliability: 81 },
  { name: 'Pharmacie Bocklé',               city: 'Garoua', neighborhood: 'Bocklé',         type: 'Pharmacy',      phone: '+237 222 274 234', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '08:00-20:00', saturday: '08:00-18:00', sunday: 'Closed',       reliability: 78 },
  { name: 'Pharmacie Poumpoumré',           city: 'Garoua', neighborhood: 'Poumpoumré',     type: 'Pharmacy',      phone: '+237 222 276 567', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-20:00', saturday: '08:00-18:00', sunday: 'Closed',       reliability: 77 },
  { name: 'Pharmacie de Garde Lopéré',      city: 'Garoua', neighborhood: 'Lopéré',         type: 'Pharmacy',      phone: '+237 222 272 012', is_open: false, is_on_duty: true,  momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 90 },
  { name: 'Laboratoire Garoua Centre',      city: 'Garoua', neighborhood: 'Centre',         type: 'Laboratory',    phone: '+237 222 271 789', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-17:00', saturday: '07:00-13:00', sunday: 'Closed',       reliability: 85 },
  { name: 'Labo Analyse Lopéré',            city: 'Garoua', neighborhood: 'Lopéré',         type: 'Laboratory',    phone: '+237 222 272 456', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '07:00-16:00', saturday: '07:00-12:00', sunday: 'Closed',       reliability: 80 },
  { name: 'CSI de Bocklé',                  city: 'Garoua', neighborhood: 'Bocklé',         type: 'Health center', phone: '+237 222 274 567', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 74 },
  { name: 'Centre de Santé Lopéré',         city: 'Garoua', neighborhood: 'Lopéré',         type: 'Health center', phone: '+237 222 272 901', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-12:00', sunday: 'Closed',       reliability: 72 },
  { name: 'CSI Grand Marché',               city: 'Garoua', neighborhood: 'Grand Marché',   type: 'Health center', phone: '+237 222 275 678', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 70 },

  // ══════════════════════════════════════════════════════
  // MAROUA (15 facilities)
  // ══════════════════════════════════════════════════════
  { name: 'Hôpital Régional de Maroua',     city: 'Maroua', neighborhood: 'Centre',         type: 'Hospital',      phone: '+237 222 291 001', is_open: true,  is_on_duty: false, momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 90 },
  { name: 'Hôpital de District Maroua',     city: 'Maroua', neighborhood: 'Dougoy',         type: 'Hospital',      phone: '+237 222 292 234', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 76 },
  { name: 'Clinique Maroua Centre',         city: 'Maroua', neighborhood: 'Centre',         type: 'Clinic',        phone: '+237 222 293 567', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-19:00', saturday: '07:00-16:00', sunday: '09:00-14:00',  reliability: 84 },
  { name: 'Clinique Kodek',                 city: 'Maroua', neighborhood: 'Kodek',          type: 'Clinic',        phone: '+237 222 294 890', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-18:00', saturday: '08:00-14:00', sunday: 'Closed',       reliability: 78 },
  { name: 'Pharmacie de Garde Maroua',      city: 'Maroua', neighborhood: 'Centre',         type: 'Pharmacy',      phone: '+237 222 291 500', is_open: true,  is_on_duty: true,  momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 92 },
  { name: 'Pharmacie du Marché Central',    city: 'Maroua', neighborhood: 'Marché Central', type: 'Pharmacy',      phone: '+237 222 295 234', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '08:00-20:00', saturday: '08:00-20:00', sunday: '10:00-16:00',  reliability: 85 },
  { name: 'Pharmacie Dougoy',               city: 'Maroua', neighborhood: 'Dougoy',         type: 'Pharmacy',      phone: '+237 222 292 678', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-20:00', saturday: '08:00-18:00', sunday: 'Closed',       reliability: 80 },
  { name: 'Pharmacie Kodek',                city: 'Maroua', neighborhood: 'Kodek',          type: 'Pharmacy',      phone: '+237 222 294 234', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '08:00-20:00', saturday: '08:00-18:00', sunday: 'Closed',       reliability: 77 },
  { name: 'Pharmacie Domayo',               city: 'Maroua', neighborhood: 'Domayo',         type: 'Pharmacy',      phone: '+237 222 296 567', is_open: false, is_on_duty: false, momo: true,  orange: false, weekdays: '08:00-20:00', saturday: '08:00-18:00', sunday: 'Closed',       reliability: 76 },
  { name: 'Pharmacie de Garde Dougoy',      city: 'Maroua', neighborhood: 'Dougoy',         type: 'Pharmacy',      phone: '+237 222 292 012', is_open: false, is_on_duty: true,  momo: true,  orange: true,  weekdays: '00:00-23:59', saturday: '00:00-23:59', sunday: '00:00-23:59', reliability: 89 },
  { name: 'Laboratoire Maroua Centre',      city: 'Maroua', neighborhood: 'Centre',         type: 'Laboratory',    phone: '+237 222 291 789', is_open: false, is_on_duty: false, momo: true,  orange: true,  weekdays: '07:00-17:00', saturday: '07:00-13:00', sunday: 'Closed',       reliability: 84 },
  { name: 'Labo Dougoy',                    city: 'Maroua', neighborhood: 'Dougoy',         type: 'Laboratory',    phone: '+237 222 292 456', is_open: false, is_on_duty: false, momo: false, orange: true,  weekdays: '07:00-16:00', saturday: '07:00-12:00', sunday: 'Closed',       reliability: 79 },
  { name: 'CSI de Kodek',                   city: 'Maroua', neighborhood: 'Kodek',          type: 'Health center', phone: '+237 222 294 567', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 73 },
  { name: 'Centre de Santé Dougoy',         city: 'Maroua', neighborhood: 'Dougoy',         type: 'Health center', phone: '+237 222 292 901', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-12:00', sunday: 'Closed',       reliability: 71 },
  { name: 'CSI Domayo',                     city: 'Maroua', neighborhood: 'Domayo',         type: 'Health center', phone: '+237 222 296 234', is_open: false, is_on_duty: false, momo: false, orange: false, weekdays: '07:30-15:30', saturday: '07:30-13:00', sunday: 'Closed',       reliability: 70 },
];

// ─── 3. Seed facilities ────────────────────────────────────────────────────────
async function seedFacilities() {
  console.log(`\n Seeding ${facilities.length} facilities across 6 cities...\n`);

  const cities = [...new Set(facilities.map(f => f.city))];
  for (const city of cities) {
    const cityFacilities = facilities.filter(f => f.city === city);
    console.log(`${city}: ${cityFacilities.length} facilities`);
  }
  console.log('');

  let success = 0;
  let failed = 0;

  for (const f of facilities) {
    const today = new Date().toISOString().split('T')[0];

    const res = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties: {
          "Name":                { title:       [{ text: { content: f.name } }] },
          "City":                { select:       { name: f.city }               },
          "Type":                { select:       { name: f.type }               },
          "Neighborhood":        { rich_text:   [{ text: { content: f.neighborhood } }] },
          "Phone":               { phone_number: f.phone                        },
          "Is_Open_Now":         { checkbox:     f.is_open                      },
          "Is_On_Duty":          { checkbox:     f.is_on_duty                   },
          "Accepts_MTN_MoMo":    { checkbox:     f.momo                         },
          "Accepts_Orange_Money":{ checkbox:     f.orange                       },
          "Weekdays_Hours":      { rich_text:   [{ text: { content: f.weekdays } }] },
          "Saturday_Hours":      { rich_text:   [{ text: { content: f.saturday } }] },
          "Sunday_Hours":        { rich_text:   [{ text: { content: f.sunday  } }] },
          "Reliability_Score":   { number:       f.reliability                  },
          "Last_Updated":        { date:        { start: today }                }
        }
      })
    });

    if (res.ok) {
      console.log(`  [${f.city}] ${f.name}`);
      success++;
    } else {
      const err = await res.json();
      console.error(`[${f.city}] ${f.name}: ${err.message}`);
      failed++;
    }

    await new Promise(r => setTimeout(r, 350));
  }

  console.log(`\n Results: ${success} created, ${failed} failed`);
}

// ─── Run ───────────────────────────────────────────────────────────────────────
(async () => {
  console.log('HealthNearby AI — Notion Setup (200 facilities)\n');
  console.log('Cities: Douala (70) · Yaoundé (50) · Bafoussam (25) · Bamenda (25) · Garoua (15) · Maroua (15)\n');
  await setupDatabaseSchema();
  await seedFacilities();
  console.log('\n Setup complete!');
})();