import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

// ─── BASE URL DAS IMAGENS ──────────────────────────────────────────────────────
const BP = 'https://beybladeplanner.com/img';
const NO_IMG = `${BP}/noimage.png`;

// ─── INTELIGÊNCIA DE CONDIÇÕES E PRECIFICAÇÃO ────────────────────────────────
const CONDICOES_INFO = {
  'Novo na embalagem': { badge: '#10b981', peso: 1.0, icone: '📦', textoCor: '#fff' },
  'Novo':              { badge: '#3b82f6', peso: 0.9, icone: '✨', textoCor: '#fff' },
  'Usado':             { badge: '#eab308', peso: 0.7, icone: '⚔️', textoCor: '#000' },
  'Muito usado':       { badge: '#ef4444', peso: 0.5, icone: '🩹', textoCor: '#fff' }
};

// ─── MAPAS DE IMAGENS (BLADES, RATCHETS, BITS) ────────────────────────────────
const BLADE_IMG = { 'Aero Pegasus': `${BP}/blade/AeroPegasus_p.png`, 'Bear Scratch': `${BP}/blade/BearScratch_p.png`, 'Black Shell': `${BP}/blade/BlackShell_p.png`, 'Cobalt Dragoon': `${BP}/blade/CobaltDragoon_p.png`, 'Cobalt Drake': `${BP}/blade/Cobaltdrake_p.png`, 'Crimson Garuda': `${BP}/blade/CrimsonGaruda_p.png`, 'Croco Crunch': `${BP}/blade/CrocoCrunch_p.png`, 'Draciel Shield': `${BP}/blade/DracielShield_p.png`, 'Dragoon Storm': `${BP}/blade/DragoonStorm_p.png`, 'Dran Buster': `${BP}/blade/DranBuster_p.png`, 'Dran Dagger': `${BP}/blade/DranDagger_p.png`, 'Dran Sword': `${BP}/blade/Dransword_p.png`, 'Dranzer Spiral': `${BP}/blade/Dranzerspiral_p.png`, 'Dranzer Spriral': `${BP}/blade/Dranzerspiral_p.png`, 'Driger Slash': `${BP}/blade/DrigerSlash_p.png`, 'Ghost Circle': `${BP}/blade/GhostCircle_p.png`, 'Golem Rock': `${BP}/blade/GolemRock_p.png`, 'Hells Chain': `${BP}/blade/HellsChain_p.png`, 'Hells Hammer': `${BP}/blade/HellsHammer_p.png`, 'Hells Scythe': `${BP}/blade/Hellsscythe_p.png`, 'Impact Drake': `${BP}/blade/ImpactDrake_p.png`, 'Knight Lance': `${BP}/blade/Knightlance_p.png`, 'Knight Mail': `${BP}/blade/KnightMail_p.png`, 'Knight Shield': `${BP}/blade/Knightshield_p.png`, 'Leon Claw': `${BP}/blade/LeonClaw_p.png`, 'Leon Crest': `${BP}/blade/LionCrest_p.png`, 'Lightning L-Drago': `${BP}/blade/LDragoRapid_p.png`, 'Mammoth Tusk': `${BP}/blade/MammothTusk_p.png`, 'Phoenix Feather': `${BP}/blade/PhoenixFeather_p.png`, 'Phoenix Rudder': `${BP}/blade/PhoenixRudder_p.png`, 'Phoenix Wing': `${BP}/blade/PhoenixWing_p.png`, 'Ptera Swing': `${BP}/blade/PteraSwing_p.png`, 'Rhino Horn': `${BP}/blade/RhinoHorn_p.png`, 'Roar Tyranno': NO_IMG, 'Samurai Saber': `${BP}/blade/SamuraiSaber_p.png`, 'Samurai Steel': `${BP}/blade/SamuraiSteel_p.png`, 'Scorpio Spear': `${BP}/blade/ScorpioSpear_p.png`, 'Shark Edge': `${BP}/blade/Sharkedge_p.png`, 'Shelter Drake': `${BP}/blade/ShelterDrake_p.png`, 'Shinobi Knife': `${BP}/blade/ShinobiKnife_p.png`, 'Shinobi Shadow': `${BP}/blade/ShinobiShadow_p.png`, 'Silver Wolf': `${BP}/blade/SilverWolf_p.png`, 'Sphinx Cowl': `${BP}/blade/SphinxCowl_p.png`, 'Storm Pegasis': `${BP}/blade/StormPegasis_p.png`, 'Tricera Press': `${BP}/blade/TriceraPress_p.png`, 'Tyranno Beat': `${BP}/blade/TyrannoBeat_p.png`, 'Unicorn Sting': `${BP}/blade/UnicornSting_p.png`, 'Victory Valkyrie': `${BP}/blade/VictoryValkyrie_p.png`, 'Viper Tail': `${BP}/blade/ViperTail_p.png`, 'Weiss Tiger': `${BP}/blade/WeissTiger_p.png`, 'Whale Wave': `${BP}/blade/WhaleWave_p.png`, 'Wizard Arrow': `${BP}/blade/Wizardarrow_p.png`, 'Wizard Rod': `${BP}/blade/WizardRod_p.png`, 'Wyvern Gale': `${BP}/blade/WyvernGale_p.png`, 'Xeno Xcalibur': `${BP}/blade/XenoXcalibur_p.png`, 'Yell Kong': NO_IMG };
const RATCHET_IMG = { '0-70': `${BP}/ratchet/0-70_p.png`, '0-80': `${BP}/ratchet/0-80_p.png`, '1-60': `${BP}/ratchet/1-60_p.png`, '1-80': `${BP}/ratchet/1-80_p.png`, '2-60': `${BP}/ratchet/2-60_p.png`, '2-70': `${BP}/ratchet/2-70_p.png`, '2-80': `${BP}/ratchet/2-80_p.png`, '3-60': `${BP}/ratchet/3-60_p.png`, '3-70': `${BP}/ratchet/3-70_p.png`, '3-80': `${BP}/ratchet/3-80_p.png`, '3-85': `${BP}/ratchet/3-85_p.png`, '4-55': `${BP}/ratchet/4-55_p.png`, '4-60': `${BP}/ratchet/4-60_p.png`, '4-70': `${BP}/ratchet/4-70_p.png`, '4-80': `${BP}/ratchet/4-80_p.png`, '5-60': `${BP}/ratchet/5-60_p.png`, '5-70': `${BP}/ratchet/5-70_p.png`, '5-80': `${BP}/ratchet/5-80_p.png`, '6-60': `${BP}/ratchet/6-60_p.png`, '6-80': `${BP}/ratchet/6-80_p.png`, '7-60': `${BP}/ratchet/7-60_p.png`, '7-70': `${BP}/ratchet/7-70_p.png`, '7-80': `${BP}/ratchet/7-80_p.png`, '9-60': `${BP}/ratchet/9-60_p.png`, '9-65': `${BP}/ratchet/9-60_p.png`, '9-70': `${BP}/ratchet/9-70_p.png`, '9-80': `${BP}/ratchet/9-80_p.png` };
const BIT_IMG = { 'Accel': `${BP}/bit/Accel_p.png`, 'Ball': `${BP}/bit/Ball_p.png`, 'Bound Spike': NO_IMG, 'Cyclone': `${BP}/bit/Cyclone_p.png`, 'Disc Ball': `${BP}/bit/DiscBall_p.png`, 'Disk Ball': `${BP}/bit/DiscBall_p.png`, 'Dot': `${BP}/bit/Dot_p.png`, 'Elevate': `${BP}/bit/Elevate_p.png`, 'Flat': `${BP}/bit/Flat_p.png`, 'Free Ball': NO_IMG, 'Gear Ball': `${BP}/bit/GearBall_p.png`, 'Gear Flat': `${BP}/bit/GearFlat_p.png`, 'Gear Needle': `${BP}/bit/GearNeedle_p.png`, 'Gear Point': `${BP}/bit/GearPoint_p.png`, 'Gear Rush': NO_IMG, 'Glide': `${BP}/bit/Glide_p.png`, 'Hexa': `${BP}/bit/Hexa_p.png`, 'High Needle': `${BP}/bit/Highneedle_p.png`, 'High Taper': `${BP}/bit/HighTaper_p.png`, 'Kick': NO_IMG, 'Level': NO_IMG, 'Low Flat': `${BP}/bit/LowFlat_p.png`, 'Low Orb': NO_IMG, 'Low Rush': NO_IMG, 'Metal Needle': `${BP}/bit/MetalNeedle_p.png`, 'Needle': `${BP}/bit/Needle_p.png`, 'Orb': `${BP}/bit/Orb_p.png`, 'Point': `${BP}/bit/Point_p.png`, 'Quake': `${BP}/bit/Quake_p.png`, 'Rush': `${BP}/bit/Rush_p.png`, 'Spike': `${BP}/bit/Spike_p.png`, 'Taper': `${BP}/bit/Taper_p.png`, 'Ultra': NO_IMG, 'Wall Wedge': NO_IMG };

function getImagem(nome, tipo) {
  if (!nome) return NO_IMG;
  if (tipo === 'Ratchet') { const k = nome.replace(/ratchet/gi, '').trim(); return RATCHET_IMG[k] || NO_IMG; }
  if (tipo === 'Bit') { const k = nome.replace(/\s*\(.*\)/, '').trim(); return BIT_IMG[k] || NO_IMG; }
  const keys = Object.keys(BLADE_IMG).sort((a, b) => b.length - a.length);
  for (const key of keys) { if (nome.toLowerCase().startsWith(key.toLowerCase())) return BLADE_IMG[key]; }
  return NO_IMG;
}

// ─── CATÁLOGO COMPLETO ORIGINAL ───────────────────────────────────────────────
const CATALOGO = [
  { id:'CMB01', nome:'Dran Sword 3-60F', tipo:'Combo', preco:250, subtipo:'Ataque', descricao:'BX-01 Starter. Ataque. Flat Bit para velocidade.' },
  { id:'CMB02', nome:'Hells Scythe 4-60T', tipo:'Combo', preco:250, subtipo:'Equilíbrio', descricao:'BX-02 Starter. Equilíbrio.' },
  { id:'CMB03', nome:'Wizard Arrow 4-80B', tipo:'Combo', preco:230, subtipo:'Resistência', descricao:'BX-03/05 Starter. Resistência.' },
  { id:'CMB04', nome:'Knight Shield 3-80N', tipo:'Combo', preco:230, subtipo:'Defesa', descricao:'BX-04/06 Starter. Defesa.' },
  { id:'CMB05', nome:'Knight Lance 4-80HN', tipo:'Combo', preco:235, subtipo:'Defesa', descricao:'BX-13 Booster. Defesa.' },
  { id:'CMB06', nome:'Shark Edge 3-60LF', tipo:'Combo', preco:240, subtipo:'Ataque', descricao:'BX-14 Vol.1. Ataque.' },
  { id:'CMB07', nome:'Dran Sword 3-80B', tipo:'Combo', preco:235, subtipo:'Resistência', descricao:'BX-14 Vol.1. Resistência.' },
  { id:'CMB08', nome:'Hells Scythe 4-80LF', tipo:'Combo', preco:240, subtipo:'Ataque', descricao:'BX-14 Vol.1. Ataque.' },
  { id:'CMB09', nome:'Knight Shield 4-60LF', tipo:'Combo', preco:235, subtipo:'Ataque', descricao:'BX-14 Vol.1. Ataque.' },
  { id:'CMB10', nome:'Wizard Arrow 3-60T', tipo:'Combo', preco:230, subtipo:'Equilíbrio', descricao:'BX-14 Vol.1. Equilíbrio.' },
  { id:'CMB11', nome:'Leon Claw 5-60P', tipo:'Combo', preco:240, subtipo:'Equilíbrio', descricao:'BX-15 Booster. Equilíbrio.' },
  { id:'CMB12', nome:'Viper Tail 5-80O', tipo:'Combo', preco:235, subtipo:'Resistência', descricao:'BX-16 Viper Select. Resistência.' },
  { id:'CMB13', nome:'Viper Tail 3-80HN', tipo:'Combo', preco:230, subtipo:'Defesa', descricao:'BX-16 Viper Select. Defesa.' },
  { id:'CMB14', nome:'Viper Tail 4-60F', tipo:'Combo', preco:235, subtipo:'Ataque', descricao:'BX-16 Viper Select. Ataque.' },
  { id:'CMB15', nome:'Rhino Horn 3-80S', tipo:'Combo', preco:220, subtipo:'Defesa', descricao:'BX-19 Booster. Defesa.' },
  { id:'CMB16', nome:'Dran Dagger 4-60R', tipo:'Combo', preco:260, subtipo:'Ataque', descricao:'BX-20 Deck Set. Ataque.' },
  { id:'CMB17', nome:'Shark Edge 3-80F', tipo:'Combo', preco:235, subtipo:'Ataque', descricao:'BX-20 Deck Set. Ataque.' },
  { id:'CMB18', nome:'Knight Shield 5-80T', tipo:'Combo', preco:230, subtipo:'Equilíbrio', descricao:'BX-20 Deck Set. Equilíbrio.' },
  { id:'CMB19', nome:'Hells Chain 5-60HT', tipo:'Combo', preco:250, subtipo:'Equilíbrio', descricao:'BX-21 Deck Set. Equilíbrio.' },
  { id:'CMB20', nome:'Knight Lance 3-60LF', tipo:'Combo', preco:235, subtipo:'Ataque', descricao:'BX-21 Deck Set. Ataque.' },
  { id:'CMB21', nome:'Wizard Arrow 4-80N', tipo:'Combo', preco:230, subtipo:'Defesa', descricao:'BX-21 Deck Set. Defesa.' },
  { id:'CMB22', nome:'Phoenix Wing 9-60GF', tipo:'Combo', preco:350, subtipo:'Ataque', descricao:'BX-23 Starter. Ataque. Impacto devastador.' },
  { id:'CMB23', nome:'Wyvern Gale 5-80GB', tipo:'Combo', preco:245, subtipo:'Resistência', descricao:'BX-24 Booster. Resistência.' },
  { id:'CMB24', nome:'Sphinx Cowl 9-80GN', tipo:'Combo', preco:240, subtipo:'Defesa', descricao:'BX-25 Booster. Defesa.' },
  { id:'CMB25', nome:'Tyranno Beat 4-70Q', tipo:'Combo', preco:265, subtipo:'Ataque', descricao:'BX-26 Booster. Ataque.' },
  { id:'CMB26', nome:'Rhino Horn 5-80Q', tipo:'Combo', preco:235, subtipo:'Ataque', descricao:'Booster. Ataque.' },
  { id:'CMB27', nome:'Dran Dagger 4-70P', tipo:'Combo', preco:255, subtipo:'Ataque', descricao:'Booster. Ataque.' },
  { id:'CMB28', nome:'Hells Chain 9-80O', tipo:'Combo', preco:250, subtipo:'Resistência', descricao:'Booster. Resistência.' },
  { id:'CMB29', nome:'Shark Edge 1-60Q', tipo:'Combo', preco:240, subtipo:'Ataque', descricao:'Booster. Ataque.' },
  { id:'CMB30', nome:'Unicorn Sting 5-60GP', tipo:'Combo', preco:245, subtipo:'Equilíbrio', descricao:'Booster. Equilíbrio.' },
  { id:'CMB31', nome:'Unicorn Sting 3-70D', tipo:'Combo', preco:240, subtipo:'Resistência', descricao:'Booster. Resistência.' },
  { id:'CMB32', nome:'Sphinx Cowl 4-80HT', tipo:'Combo', preco:235, subtipo:'Equilíbrio', descricao:'Booster. Equilíbrio.' },
  { id:'CMB33', nome:'Sphinx Cowl 5-60O', tipo:'Combo', preco:235, subtipo:'Resistência', descricao:'Booster. Resistência.' },
  { id:'CMB34', nome:'Tyranno Beat 3-60S', tipo:'Combo', preco:255, subtipo:'Defesa', descricao:'Booster. Defesa.' },
  { id:'CMB35', nome:'Leon Claw 3-80HN', tipo:'Combo', preco:235, subtipo:'Defesa', descricao:'Booster. Defesa.' },
  { id:'CMB36', nome:'Wyvern Gale 3-60T', tipo:'Combo', preco:240, subtipo:'Equilíbrio', descricao:'Booster. Equilíbrio.' },
  { id:'CMB37', nome:'Viper Tail 5-60F', tipo:'Combo', preco:235, subtipo:'Ataque', descricao:'Booster. Ataque.' },
  { id:'CMB38', nome:'Ghost Circle 0-80GB', tipo:'Combo', preco:265, subtipo:'Resistência', descricao:'Booster. Resistência.' },
  { id:'CMB39', nome:'Ghost Circle 4-60H', tipo:'Combo', preco:260, subtipo:'Equilíbrio', descricao:'Booster. Equilíbrio.' },
  { id:'CMB40', nome:'Ptera Swing 7-70B', tipo:'Combo', preco:265, subtipo:'Resistência', descricao:'Booster. Resistência.' },
  { id:'CMB41', nome:'Bear Scratch 5-60F', tipo:'Combo', preco:240, subtipo:'Ataque', descricao:'Booster. Ataque.' },
  { id:'CMB42', nome:'Whale Wave 5-80E', tipo:'Combo', preco:285, subtipo:'Equilíbrio', descricao:'Booster. Equilíbrio.' },
  { id:'CMB43', nome:'Whale Wave 3-80GB', tipo:'Combo', preco:270, subtipo:'Resistência', descricao:'Booster. Resistência.' },
  { id:'CMB44', nome:'Whale Wave 4-70HN', tipo:'Combo', preco:265, subtipo:'Defesa', descricao:'Booster. Defesa.' },
  { id:'CMB45', nome:'Silver Wolf 3-80FB', tipo:'Combo', preco:280, subtipo:'Resistência', descricao:'Booster. Resistência.' },
  { id:'CMB46', nome:'Samurai Saber 2-70L', tipo:'Combo', preco:310, subtipo:'Ataque', descricao:'Booster. Ataque.' },
  { id:'CMB47', nome:'Knight Mail 3-85BS', tipo:'Combo', preco:275, subtipo:'Defesa', descricao:'Booster. Defesa.' },
  { id:'CMB48', nome:'Tyranno Beat 1-60RA', tipo:'Combo', preco:270, subtipo:'Ataque', descricao:'Booster. Ataque.' },
  { id:'CMB49', nome:'Mammoth Tusk 2-80E', tipo:'Combo', preco:265, subtipo:'Equilíbrio', descricao:'Booster. Equilíbrio.' },
  { id:'CMB50', nome:'Crimson Garuda 4-70TP', tipo:'Combo', preco:275, subtipo:'Equilíbrio', descricao:'Booster. Equilíbrio.' },
  { id:'CMB51', nome:'Impact Drake 9-60LR', tipo:'Combo', preco:280, subtipo:'Ataque', descricao:'Booster. Ataque.' },
  { id:'CMB52', nome:'Golem Rock 1-60UN', tipo:'Combo', preco:260, subtipo:'Defesa', descricao:'Booster. Defesa.' },
  { id:'CMB53', nome:'Shelter Drake 7-80GP', tipo:'Combo', preco:270, subtipo:'Defesa', descricao:'Booster. Defesa.' },
  { id:'CMB54', nome:'Shelter Drake 5-70O', tipo:'Combo', preco:260, subtipo:'Resistência', descricao:'Booster. Resistência.' },
  { id:'CMB55', nome:'Shelter Drake 3-60D', tipo:'Combo', preco:250, subtipo:'Resistência', descricao:'Booster. Resistência.' },
  { id:'CMB56', nome:'Phoenix Wing 5-80H', tipo:'Combo', preco:260, subtipo:'Equilíbrio', descricao:'Booster. Equilíbrio.' },
  { id:'CMB57', nome:'Phoenix Wing 9-80DB', tipo:'Combo', preco:280, subtipo:'Resistência', descricao:'Booster. Resistência.' },
  { id:'CMB58', nome:'Draciel Shield 7-60D', tipo:'Combo', preco:290, subtipo:'Defesa', descricao:'Booster. Defesa.' },
  { id:'CMB59', nome:'Phoenix Rudder 9-70G', tipo:'Combo', preco:320, subtipo:'Resistência', descricao:'Booster. Resistência suprema de Fênix.' },
  { id:'CMB60', nome:'Phoenix Feather 2-60N', tipo:'Combo', preco:260, subtipo:'Defesa', descricao:'Booster. Defesa.' },
  { id:'CMB61', nome:'Wyvern Gale 2-60S', tipo:'Combo', preco:255, subtipo:'Defesa', descricao:'Booster. Defesa.' },
  { id:'CMB62', nome:'Leon Claw 0-80E', tipo:'Combo', preco:265, subtipo:'Equilíbrio', descricao:'Booster. Equilíbrio.' },
  { id:'CMB63', nome:'Croco Crunch 2-60Q', tipo:'Combo', preco:255, subtipo:'Ataque', descricao:'Booster. Ataque.' },
  { id:'CMB64', nome:'Dragoon Storm 4-60RA', tipo:'Combo', preco:380, subtipo:'Aniversário', descricao:'25º Aniversário.', raro:true },
  { id:'CMB65', nome:'Storm Pegasis 3-70RA', tipo:'Combo', preco:380, subtipo:'Aniversário', descricao:'25º Aniversário.', raro:true },
  { id:'CMB66', nome:'Victory Valkyrie 2-60RA', tipo:'Combo', preco:380, subtipo:'Aniversário', descricao:'25º Aniversário.', raro:true },
  { id:'CMB67', nome:'Dranzer Spiral 3-80T', tipo:'Combo', preco:320, subtipo:'Relançamento', descricao:'Relançamento clássico.' },
  { id:'CMB68', nome:'Driger Slash 4-80P', tipo:'Combo', preco:310, subtipo:'Relançamento', descricao:'Relançamento clássico.' },
  { id:'UX01', nome:'Dran Buster 1-60A', tipo:'Combo', preco:280, subtipo:'UX Ataque', descricao:'UX-01 Starter. Ataque.' },
  { id:'UX02', nome:'Hells Hammer 3-70H', tipo:'Combo', preco:275, subtipo:'UX Equilíbrio', descricao:'UX-02 Starter. Equilíbrio.' },
  { id:'UX03', nome:'Wizard Rod 5-70DB', tipo:'Combo', preco:300, subtipo:'UX Resistência', descricao:'UX-03 Starter. Resistência.' },
  { id:'UX04', nome:'Shinobi Shadow 1-80MN', tipo:'Combo', preco:260, subtipo:'UX Defesa', descricao:'UX-04 Booster. Defesa.' },
  { id:'UX05', nome:'Leon Crest 7-60GN', tipo:'Combo', preco:270, subtipo:'UX Defesa', descricao:'UX-05 Booster. Defesa.' },
  { id:'UX06', nome:'Weiss Tiger 3-60U', tipo:'Combo', preco:270, subtipo:'UX Equilíbrio', descricao:'UX-06 Booster. Equilíbrio.' },
  { id:'UX07', nome:'Black Shell 4-60D', tipo:'Combo', preco:265, subtipo:'UX Resistência', descricao:'UX-07 Booster. Resistência.' },
  { id:'UX08', nome:'Black Shell 9-80B', tipo:'Combo', preco:260, subtipo:'UX Resistência', descricao:'UX Booster. Resistência.' },
  { id:'UX09', nome:'Shinobi Shadow 9-60LF', tipo:'Combo', preco:265, subtipo:'UX Ataque', descricao:'UX Booster. Ataque.' },
  { id:'UX10', nome:'Wizard Rod 1-60R', tipo:'Combo', preco:280, subtipo:'UX Ataque', descricao:'UX Booster. Ataque.' },
  { id:'UX11', nome:'Viper Tail 5-70D', tipo:'Combo', preco:265, subtipo:'UX Resistência', descricao:'UX Booster. Resistência.' },
  { id:'UX12', nome:'Dran Dagger 2-80GP', tipo:'Combo', preco:265, subtipo:'UX Equilíbrio', descricao:'UX Booster. Equilíbrio.' },
  { id:'UX13', nome:'Samurai Steel 4-80T', tipo:'Combo', preco:275, subtipo:'UX Equilíbrio', descricao:'UX Booster. Equilíbrio.' },
  { id:'RARE01', nome:'Cobalt Drake 4-60F', tipo:'Combo', preco:1500, subtipo:'Raro', descricao:'⚡ RARÍSSIMO — Premiação B4.', raro:true },
  { id:'RARE02', nome:'Aero Pegasus 3-70A', tipo:'Combo', preco:1200, subtipo:'Raro', descricao:'⚡ RARÍSSIMO — Premiação Especial.', raro:true },
  { id:'RARE03', nome:'Cobalt Dragoon 2-60C', tipo:'Combo', preco:380, subtipo:'Left-Spin', descricao:'⭐ Giro à ESQUERDA!.', raro:true },
  { id:'RARE04', nome:'Phoenix Wing 9-60GF Black', tipo:'Combo', preco:700, subtipo:'Metal Coat', descricao:'⭐ Metal Coat Black.', raro:true },
  { id:'RARE05', nome:'Leon Claw 5-60P Gold', tipo:'Combo', preco:900, subtipo:'Metal Coat', descricao:'⭐ Gold Coat Edition.', raro:true },
  { id:'RARE06', nome:'Dran Buster 1-60A Red', tipo:'Combo', preco:650, subtipo:'Metal Coat', descricao:'⭐ Metal Coat Red.', raro:true },
  { id:'RARE07', nome:'Xeno Xcalibur 4-60F', tipo:'Combo', preco:420, subtipo:'Especial', descricao:'⭐ Relançamento Xcalibur.', raro:true },
  { id:'BLD01', nome:'Dran Sword', tipo:'Blade', preco:120, descricao:'Ataque — Lâmina veloz com pontas metálicas.' },
  { id:'BLD02', nome:'Dran Dagger', tipo:'Blade', preco:125, descricao:'Ataque — Múltiplas lâminas.' },
  { id:'BLD03', nome:'Dran Buster', tipo:'Blade', preco:140, descricao:'Ataque UX — Ponto único de impacto.' },
  { id:'BLD04', nome:'Hells Scythe', tipo:'Blade', preco:120, descricao:'Equilíbrio — Foice infernal.' },
  { id:'BLD05', nome:'Hells Chain', tipo:'Blade', preco:125, descricao:'Equilíbrio — Correntes de metal.' },
  { id:'BLD06', nome:'Hells Hammer', tipo:'Blade', preco:135, descricao:'Equilíbrio UX — Martelo pesado.' },
  { id:'BLD07', nome:'Wizard Arrow', tipo:'Blade', preco:120, descricao:'Resistência — Pás de flecha.' },
  { id:'BLD08', nome:'Wizard Rod', tipo:'Blade', preco:145, descricao:'Resistência UX — Alta inércia.' },
  { id:'BLD09', nome:'Knight Shield', tipo:'Blade', preco:120, descricao:'Defesa — Absorve impactos centrais.' },
  { id:'BLD10', nome:'Knight Lance', tipo:'Blade', preco:122, descricao:'Defesa — Lance com contra-ataques.' },
  { id:'BLD11', nome:'Knight Mail', tipo:'Blade', preco:130, descricao:'Defesa — Armadura completa.' },
  { id:'BLD12', nome:'Shark Edge', tipo:'Blade', preco:122, descricao:'Ataque — Lâminas de tubarão.' },
  { id:'BLD13', nome:'Leon Claw', tipo:'Blade', preco:125, descricao:'Equilíbrio — Garras de leão.' },
  { id:'BLD14', nome:'Leon Crest', tipo:'Blade', preco:135, descricao:'Defesa UX — Crista do leão.' },
  { id:'BLD15', nome:'Phoenix Wing', tipo:'Blade', preco:155, descricao:'Ataque — 9 lados de metal pesado.' },
  { id:'BLD16', nome:'Phoenix Rudder', tipo:'Blade', preco:160, descricao:'Resistência — 9 lados.' },
  { id:'BLD17', nome:'Phoenix Feather', tipo:'Blade', preco:130, descricao:'Defesa — Penas leves.' },
  { id:'BLD18', nome:'Viper Tail', tipo:'Blade', preco:122, descricao:'Resistência — Cauda de víbora.' },
  { id:'BLD19', nome:'Cobalt Dragoon', tipo:'Blade', preco:170, descricao:'Ataque — Primeiro Left-Spin BX!' },
  { id:'BLD20', nome:'Cobalt Drake', tipo:'Blade', preco:300, descricao:'Ataque RARO — Drake de Cobalto.', raro:true },
  { id:'BLD21', nome:'Wyvern Gale', tipo:'Blade', preco:125, descricao:'Resistência — 5 lados aerodinâmicos.' },
  { id:'BLD22', nome:'Rhino Horn', tipo:'Blade', preco:120, descricao:'Defesa — Chifre compacto.' },
  { id:'BLD23', nome:'Tyranno Beat', tipo:'Blade', preco:135, descricao:'Ataque — Tiranossauro.' },
  { id:'BLD24', nome:'Sphinx Cowl', tipo:'Blade', preco:128, descricao:'Defesa — 9 lados.' },
  { id:'BLD25', nome:'Unicorn Sting', tipo:'Blade', preco:128, descricao:'Equilíbrio — Ferrão de unicórnio.' },
  { id:'BLD26', nome:'Shinobi Shadow', tipo:'Blade', preco:132, descricao:'Defesa UX — Sombra furtiva.' },
  { id:'BLD27', nome:'Black Shell', tipo:'Blade', preco:132, descricao:'Resistência UX — Casco.' },
  { id:'BLD28', nome:'Weiss Tiger', tipo:'Blade', preco:130, descricao:'Equilíbrio UX — Tigre branco.' },
  { id:'BLD29', nome:'Whale Wave', tipo:'Blade', preco:140, descricao:'Equilíbrio — Grande massa.' },
  { id:'BLD30', nome:'Silver Wolf', tipo:'Blade', preco:135, descricao:'Resistência — Circular.' },
  { id:'BLD31', nome:'Samurai Saber', tipo:'Blade', preco:145, descricao:'Ataque — Sabre afiado.' },
  { id:'BLD32', nome:'Samurai Steel', tipo:'Blade', preco:145, descricao:'Equilíbrio — Aço temperado.' },
  { id:'BLD33', nome:'Bear Scratch', tipo:'Blade', preco:128, descricao:'Ataque — 5 lados.' },
  { id:'BLD34', nome:'Ghost Circle', tipo:'Blade', preco:132, descricao:'Resistência — Círculo desbalanceado.' },
  { id:'BLD35', nome:'Ptera Swing', tipo:'Blade', preco:140, descricao:'Resistência — Pterodáctilo.' },
  { id:'BLD36', nome:'Mammoth Tusk', tipo:'Blade', preco:132, descricao:'Equilíbrio — Presas de mamute.' },
  { id:'BLD37', nome:'Crimson Garuda', tipo:'Blade', preco:135, descricao:'Equilíbrio — Garuda carmesim.' },
  { id:'BLD38', nome:'Impact Drake', tipo:'Blade', preco:138, descricao:'Ataque — 9 lados pesados.' },
  { id:'BLD39', nome:'Golem Rock', tipo:'Blade', preco:130, descricao:'Defesa — 1 ponto ultradefensivo.' },
  { id:'BLD40', nome:'Shelter Drake', tipo:'Blade', preco:135, descricao:'Defesa/Resistência — 7 lados.' },
  { id:'BLD41', nome:'Croco Crunch', tipo:'Blade', preco:128, descricao:'Ataque — 2 lados jacaré.' },
  { id:'BLD42', nome:'Aero Pegasus', tipo:'Blade', preco:150, descricao:'Ataque RARO — Pegasus.', raro:true },
  { id:'BLD43', nome:'Dranzer Spriral', tipo:'Blade', preco:148, descricao:'Equilíbrio — Relançamento Dranzer.' },
  { id:'BLD44', nome:'Driger Slash', tipo:'Blade', preco:148, descricao:'Ataque — Relançamento Driger.' },
  { id:'BLD45', nome:'Dragoon Storm', tipo:'Blade', preco:200, descricao:'Ataque 25 Anos.', raro:true },
  { id:'BLD46', nome:'Storm Pegasis', tipo:'Blade', preco:200, descricao:'Ataque 25 Anos.', raro:true },
  { id:'BLD47', nome:'Victory Valkyrie', tipo:'Blade', preco:200, descricao:'Ataque 25 Anos.', raro:true },
  { id:'BLD48', nome:'Draciel Shield', tipo:'Blade', preco:150, descricao:'Defesa — Relançamento Draciel.' },
  { id:'BLD49', nome:'Shinobi Knife', tipo:'Blade', preco:132, descricao:'Defesa — Faca ninja furtiva.' },
  { id:'BLD50', nome:'Scorpio Spear', tipo:'Blade', preco:138, descricao:'Ataque — Lança de escorpião.' },
  { id:'BLD51', nome:'Tricera Press', tipo:'Blade', preco:135, descricao:'Defesa — Triceratops.' },
  { id:'BLD52', nome:'Xeno Xcalibur', tipo:'Blade', preco:200, descricao:'Ataque — Xcalibur lendário.', raro:true },
  { id:'RTC00', nome:'0-80', tipo:'Ratchet', preco:55, descricao:'0 lados (circular) / 80mm.' },
  { id:'RTC01', nome:'1-60', tipo:'Ratchet', preco:50, descricao:'1 lado / 60mm.' },
  { id:'RTC02', nome:'1-80', tipo:'Ratchet', preco:52, descricao:'1 lado / 80mm.' },
  { id:'RTC03', nome:'2-60', tipo:'Ratchet', preco:50, descricao:'2 lados / 60mm.' },
  { id:'RTC04', nome:'2-70', tipo:'Ratchet', preco:50, descricao:'2 lados / 70mm.' },
  { id:'RTC05', nome:'2-80', tipo:'Ratchet', preco:52, descricao:'2 lados / 80mm.' },
  { id:'RTC06', nome:'3-60', tipo:'Ratchet', preco:45, descricao:'3 lados / 60mm.' },
  { id:'RTC07', nome:'3-70', tipo:'Ratchet', preco:45, descricao:'3 lados / 70mm.' },
  { id:'RTC08', nome:'3-80', tipo:'Ratchet', preco:48, descricao:'3 lados / 80mm.' },
  { id:'RTC09', nome:'3-85', tipo:'Ratchet', preco:55, descricao:'3 lados / 85mm.' },
  { id:'RTC10', nome:'4-55', tipo:'Ratchet', preco:48, descricao:'4 lados / 55mm.' },
  { id:'RTC11', nome:'4-60', tipo:'Ratchet', preco:50, descricao:'4 lados / 60mm.' },
  { id:'RTC12', nome:'4-70', tipo:'Ratchet', preco:50, descricao:'4 lados / 70mm.' },
  { id:'RTC13', nome:'4-80', tipo:'Ratchet', preco:52, descricao:'4 lados / 80mm.' },
  { id:'RTC14', nome:'5-60', tipo:'Ratchet', preco:52, descricao:'5 lados / 60mm.' },
  { id:'RTC15', nome:'5-70', tipo:'Ratchet', preco:55, descricao:'5 lados / 70mm.' },
  { id:'RTC16', nome:'5-80', tipo:'Ratchet', preco:58, descricao:'5 lados / 80mm.' },
  { id:'RTC17', nome:'6-60', tipo:'Ratchet', preco:55, descricao:'6 lados / 60mm.' },
  { id:'RTC18', nome:'6-80', tipo:'Ratchet', preco:58, descricao:'6 lados / 80mm.' },
  { id:'RTC19', nome:'7-60', tipo:'Ratchet', preco:60, descricao:'7 lados / 60mm.' },
  { id:'RTC20', nome:'7-70', tipo:'Ratchet', preco:60, descricao:'7 lados / 70mm.' },
  { id:'RTC21', nome:'7-80', tipo:'Ratchet', preco:62, descricao:'7 lados / 80mm.' },
  { id:'RTC22', nome:'9-60', tipo:'Ratchet', preco:65, descricao:'9 lados / 60mm.' },
  { id:'RTC23', nome:'9-70', tipo:'Ratchet', preco:67, descricao:'9 lados / 70mm.' },
  { id:'RTC24', nome:'9-80', tipo:'Ratchet', preco:70, descricao:'9 lados / 80mm.' },
  { id:'BIT01', nome:'Flat (F)', tipo:'Bit', preco:35, descricao:'ATAQUE — Plana.' },
  { id:'BIT02', nome:'Low Flat (LF)', tipo:'Bit', preco:35, descricao:'ATAQUE — Plana baixa.' },
  { id:'BIT03', nome:'Gear Flat (GF)', tipo:'Bit', preco:40, descricao:'ATAQUE — Flat engrenagem.' },
  { id:'BIT04', nome:'Rush (R)', tipo:'Bit', preco:35, descricao:'ATAQUE — Ponta de flor.' },
  { id:'BIT05', nome:'Low Rush (LR)', tipo:'Bit', preco:38, descricao:'ATAQUE — Rush rasante.' },
  { id:'BIT06', nome:'Gear Rush (GR)', tipo:'Bit', preco:42, descricao:'ATAQUE — Rush engrenagem.' },
  { id:'BIT07', nome:'Accel (A)', tipo:'Bit', preco:38, descricao:'ATAQUE — Aceleração.' },
  { id:'BIT08', nome:'Rapid Accel (RA)', tipo:'Bit', preco:45, descricao:'ATAQUE — Accel turbinado.' },
  { id:'BIT09', nome:'Cyclone (C)', tipo:'Bit', preco:40, descricao:'ATAQUE — Redemoinho instável.' },
  { id:'BIT10', nome:'Quake (Q)', tipo:'Bit', preco:40, descricao:'ATAQUE — Pula no estádio.' },
  { id:'BIT11', nome:'Point (P)', tipo:'Bit', preco:35, descricao:'EQUILÍBRIO — Cônica.' },
  { id:'BIT12', nome:'Gear Point (GP)', tipo:'Bit', preco:40, descricao:'EQUILÍBRIO — Point engrenagem.' },
  { id:'BIT13', nome:'Taper (T)', tipo:'Bit', preco:35, descricao:'EQUILÍBRIO — Cônica estreita.' },
  { id:'BIT14', nome:'High Taper (HT)', tipo:'Bit', preco:38, descricao:'EQUILÍBRIO — Taper alto.' },
  { id:'BIT15', nome:'Elevate (E)', tipo:'Bit', preco:42, descricao:'EQUILÍBRIO — Eleva o Bey.' },
  { id:'BIT16', nome:'Hexa (H)', tipo:'Bit', preco:40, descricao:'EQUILÍBRIO — 6 pontos hexagonais.' },
  { id:'BIT17', nome:'Glide (G)', tipo:'Bit', preco:42, descricao:'EQUILÍBRIO — Desliza suavemente.' },
  { id:'BIT18', nome:'Ball (B)', tipo:'Bit', preco:35, descricao:'RESISTÊNCIA — Esfera clássica.' },
  { id:'BIT19', nome:'Gear Ball (GB)', tipo:'Bit', preco:40, descricao:'RESISTÊNCIA — Ball engrenagem.' },
  { id:'BIT20', nome:'Orb (O)', tipo:'Bit', preco:38, descricao:'RESISTÊNCIA — Orbe esférico.' },
  { id:'BIT21', nome:'Disc Ball (DB)', tipo:'Bit', preco:40, descricao:'RESISTÊNCIA — Disco.' },
  { id:'BIT22', nome:'Free Ball (FB)', tipo:'Bit', preco:45, descricao:'RESISTÊNCIA — Bola independente.' },
  { id:'BIT23', nome:'Dot (D)', tipo:'Bit', preco:35, descricao:'RESISTÊNCIA — Ponto único.' },
  { id:'BIT24', nome:'Low Orb (LO)', tipo:'Bit', preco:38, descricao:'RESISTÊNCIA — Orbe baixo.' },
  { id:'BIT25', nome:'Needle (N)', tipo:'Bit', preco:35, descricao:'DEFESA — Agulha fina.' },
  { id:'BIT26', nome:'High Needle (HN)', tipo:'Bit', preco:38, descricao:'DEFESA — Agulha alta.' },
  { id:'BIT27', nome:'Gear Needle (GN)', tipo:'Bit', preco:42, descricao:'DEFESA — Needle engrenagem.' },
  { id:'BIT28', nome:'Metal Needle (MN)', tipo:'Bit', preco:48, descricao:'DEFESA UX — Agulha de metal.' },
  { id:'BIT29', nome:'Spike (S)', tipo:'Bit', preco:35, descricao:'DEFESA — Cravo no chão.' },
  { id:'BIT30', nome:'Bound Spike (BS)', tipo:'Bit', preco:42, descricao:'DEFESA — Spike com mola.' }
];

function ProdImg({ nome, tipo, customSrc, style, onClick }) {
  const nomeImg = typeof nome === 'string' ? nome : 'Imagem do produto';
  const tipoImg = typeof tipo === 'string' ? tipo : 'Combo';
  const srcSeguro = typeof customSrc === 'string' && customSrc.trim() ? customSrc : getImagem(nomeImg, tipoImg);

  return (
    <img
      src={srcSeguro}
      alt={nomeImg}
      loading="lazy"
      onError={e => {
        const img = e.currentTarget;
        if (img && img.src !== NO_IMG) img.src = NO_IMG;
      }}
      style={style}
      onClick={onClick}
    />
  );
}

function BeySpinner({ style }) {
  return (
    <svg width="360" height="360" viewBox="0 0 200 200" style={style} xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(255,30,30,0.3)" strokeWidth="1"/>
      <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(255,30,30,0.2)" strokeWidth="0.5"/>
      {[0,45,90,135,180,225,270,315].map((a,i)=><g key={i} transform={`rotate(${a} 100 100)`}><path d="M100 5 L110 55 L100 65 L90 55 Z" fill="rgba(255,30,30,0.4)"/></g>)}
      <circle cx="100" cy="100" r="20" fill="rgba(255,30,30,0.15)" stroke="rgba(255,30,30,0.5)" strokeWidth="1.5"/>
      <circle cx="100" cy="100" r="6" fill="rgba(255,30,30,0.7)"/>
    </svg>
  );
}

const TIPOS = ['Todos','Combo','Blade','Ratchet','Bit'];

const safeJSONParse = (key, fallback) => {
  try { const item = localStorage.getItem(key); return item ? JSON.parse(item) : fallback; } 
  catch (e) { return fallback; }
};


// Evita tela totalmente branca se algum componente quebrar na renderização.
class ErroBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { erro: null };
  }

  static getDerivedStateFromError(erro) {
    return { erro };
  }

  componentDidCatch(erro, info) {
    console.error('Erro capturado na interface:', erro, info);
  }

  render() {
    if (this.state.erro) {
      return (
        <div className="empty-state" style={{maxWidth:'900px', margin:'40px auto', background:'#111', border:'1px solid #333', borderRadius:'16px', padding:'40px 20px'}}>
          <div className="icon">⚠️</div>
          <h3>Opa, esta página encontrou um erro.</h3>
          <p style={{color:'#888', marginBottom:'20px'}}>A interface não foi apagada; o erro foi capturado no console do navegador para facilitar o ajuste.</p>
          <button className="btn" onClick={() => window.location.reload()}>Recarregar site</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// ─── AUTH FORM ────────────────────────────────────────────────────────────────
function AuthForm({ setUsuario }) {
  const [lEmail, setLEmail] = useState(''); const [lSenha, setLSenha] = useState('');
  const [cNome, setCNome] = useState(''); const [cNomeReal, setCNomeReal] = useState('');
  const [cCPF, setCCPF] = useState(''); const [cEmail, setCEmail] = useState('');
  const [cSenha, setCSenha] = useState(''); const [loading, setLoading] = useState(false);

  const fazerLogin = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const { data, error } = await supabase.from('usuarios').select('*').eq('email', lEmail).eq('senha', lSenha);
      if (error) throw error;
      if (!data || data.length === 0) alert('❌ E-mail ou senha incorretos!'); else setUsuario(data[0]);
    } catch (err) { alert(`Erro no Login: ${err.message || 'Falha na conexão'}`); } finally { setLoading(false); }
  };

  const fazerCad = async e => {
    e.preventDefault(); if(cCPF.length !== 11) return alert('O CPF deve ter exatamente 11 números!'); setLoading(true);
    try {
      const { data, error } = await supabase.from('usuarios').insert([{ nome: cNome, nome_real: cNomeReal, cpf: cCPF, email: cEmail, senha: cSenha, verificado: true }]).select();
      if (error) throw error;
      alert('✅ Conta criada com sucesso!'); setUsuario(data[0]);
    } catch (err) {
      if (err.code === '23505') alert('❌ Erro: Este E-mail ou CPF já está cadastrado no sistema!'); else alert(`❌ Erro ao criar conta: ${err.message}`);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>🌪️ Já sou Blader</h2><p className="subtitle">Entre para comprar e vender</p>
        <form onSubmit={fazerLogin}>
          <input type="email" placeholder="E-mail" value={lEmail} onChange={ev=>setLEmail(ev.target.value)} required/>
          <input type="password" placeholder="Senha" value={lSenha} onChange={ev=>setLSenha(ev.target.value)} required/>
          <button type="submit" style={{width:'100%',borderRadius:'50px'}} disabled={loading}>{loading ? 'CARREGANDO...' : 'ENTRAR'}</button>
        </form>
      </div>
      <div className="auth-box destaque">
        <h2>🛡️ Criar Conta</h2><p className="subtitle">Cadastro verificado e seguro</p>
        <form onSubmit={fazerCad}>
          <input type="text" placeholder="Nickname" value={cNome} onChange={ev=>setCNome(ev.target.value)} required/>
          <input type="text" placeholder="Nome Completo" value={cNomeReal} onChange={ev=>setCNomeReal(ev.target.value)} required/>
          <input type="text" placeholder="CPF (Apenas números)" maxLength="11" value={cCPF} onChange={ev=>setCCPF(ev.target.value)} required/>
          <input type="email" placeholder="E-mail" value={cEmail} onChange={ev=>setCEmail(ev.target.value)} required/>
          <input type="password" placeholder="Senha" value={cSenha} onChange={ev=>setCSenha(ev.target.value)} required/>
          <button type="submit" style={{width:'100%',borderRadius:'50px',background:'transparent',border:'2px solid var(--primary)',color:'#fff'}} disabled={loading}>{loading ? 'CRIANDO...' : 'CRIAR CONTA'}</button>
        </form>
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  const [pagina, setPagina]         = useState('home');
  const [mktProd, setMktProd]       = useState([]);
  const [carrinho, setCarrinho]     = useState(() => safeJSONParse('bX_cart', []));
  const [usuario, setUsuario]       = useState(() => safeJSONParse('bX_user', null));
  const [avaliacoes, setAval]       = useState([]);
  const [transacoes, setTrans]      = useState([]);
  const [loading, setLoading]       = useState(true);

  // 🟢 ESTADOS DA "PÁGINA DO ANÚNCIO" E DO CHAT 🟢
  const [anuncioSel, setAnuncioSel] = useState(null);
  const [chatAtivo, setChatAtivo]   = useState(null);
  const [mensagensChat, setMensagensChat] = useState([]);
  const [novaMsg, setNovaMsg]       = useState('');
  const [meusChats, setMeusChats]   = useState([]);
  const [anuncioAba, setAnuncioAba] = useState('detalhes');
  
  const [busca, setBusca]           = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroSub, setFiltroSub]   = useState('Todos');
  const [pecaSel, setPecaSel]       = useState(null);
  const [lightbox, setLightbox]     = useState(null);
  const [perfilTab, setPerfilTab]   = useState('anuncios');
  const [uploading, setUploading]   = useState(false);
  const [removendoAnuncioId, setRemovendoAnuncioId] = useState(null);
  const [profileLoading]            = useState(false);

  const [ordenacao, setOrdenacao]   = useState('menor_preco');
  const [vNome, setVNome]           = useState(''); 
  const [vPreco, setVPreco]         = useState('');
  const [vTipo, setVTipo]           = useState('Combo'); 
  const [vCond, setVCond]           = useState('Novo na embalagem');
  const [vDesc, setVDesc]           = useState(''); 
  const [vFile, setVFile]           = useState(null);
  const [cfgFile, setCfgFile]       = useState(null);
  const [precoSugerido, setPrecoSugerido] = useState(null);

  const [cepDestino, setCepDestino] = useState('');
  const [enderecoEntrega, setEnderecoEntrega] = useState(null);
  const [dadosFrete, setDadosFrete] = useState(null); 
  const [freteSel, setFreteSel]     = useState(null); 
  const [buscandoFrete, setBuscandoFrete] = useState(false);

  useEffect(() => {
    const fetchDadosPublicos = async () => {
      setLoading(true);
      try {
        const { data: produtos } = await supabase.from('produtos').select('*');
        const { data: aval } = await supabase.from('avaliacoes').select('*');
        if (Array.isArray(produtos)) setMktProd(produtos);
        if (Array.isArray(aval)) setAval(aval);
      } catch (err) { console.error("Erro ao carregar dados", err); } 
      finally { setLoading(false); }
    };
    fetchDadosPublicos();
  }, []);

  useEffect(() => {
    if (!usuario) return;
    const fetchDadosPrivados = async () => {
      try { 
        const nomeVendedor = `Blader (${usuario.nome})`;
        // Transações
        const { data: tData } = await supabase.from('transacoes').select('*').or(`comprador.eq."${usuario.nome}",vendedor.eq."${nomeVendedor}"`);
        if (Array.isArray(tData)) setTrans(tData); 

        // 🟢 Busca Histórico de Chats do Usuário
        const { data: cData } = await supabase.from('trade_chats').select('*').or(`comprador.eq."${usuario.nome}",vendedor.eq."${usuario.nome}"`);
        if (Array.isArray(cData)) setMeusChats(cData);
      } 
      catch (err) { console.error("Erro dados privados", err); }
    };
    fetchDadosPrivados();
  }, [usuario]);

  // 🟢 LOGICA DE TEMPO REAL DO CHAT 🟢
  useEffect(() => {
    if (!chatAtivo?.id) {
      setMensagensChat([]);
      return;
    }

    const fetchMensagens = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatAtivo.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar mensagens:', error);
        return;
      }

      setMensagensChat(Array.isArray(data) ? data : []);
    };

    fetchMensagens();

    const channel = supabase.channel(`chat_${chatAtivo.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `chat_id=eq.${chatAtivo.id}` },
        (payload) => setMensagensChat((prev) => [...prev, payload.new])
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [chatAtivo]);

  const textoSeguro = (valor, fallback = '') => {
    if (valor === null || valor === undefined) return fallback;
    if (typeof valor === 'string') return valor;
    if (typeof valor === 'number' || typeof valor === 'boolean') return String(valor);
    return fallback;
  };

  const numeroSeguro = (valor, fallback = 0) => {
    if (typeof valor === 'number') return Number.isFinite(valor) ? valor : fallback;
    if (typeof valor === 'string') {
      const limpo = valor.replace(/[^0-9,.-]/g, '').replace(',', '.');
      const num = Number(limpo);
      return Number.isFinite(num) ? num : fallback;
    }
    return fallback;
  };

  const normalizarAnuncio = (anuncio = {}) => {
    const nome = textoSeguro(anuncio.nome, 'Anúncio sem nome').trim() || 'Anúncio sem nome';
    const tipoRecebido = textoSeguro(anuncio.tipo, 'Combo').trim();
    const tipo = TIPOS.includes(tipoRecebido) && tipoRecebido !== 'Todos' ? tipoRecebido : 'Combo';
    const vendedor = textoSeguro(anuncio.vendedor, 'Oficial').trim() || 'Oficial';
    const descricao = textoSeguro(anuncio.descricao, '');
    const preco = numeroSeguro(anuncio.preco, 0);
    const imagem = textoSeguro(anuncio.imagem, '') || getImagem(nome, tipo);
    const condicao = CONDICOES_INFO[anuncio.condicao] ? anuncio.condicao : 'Usado';

    return {
      ...anuncio,
      id: anuncio.id || `${nome}-${vendedor}-${preco}`,
      nome,
      tipo,
      preco,
      condicao,
      vendedor,
      descricao,
      imagem
    };
  };

  const nomeRealDoVendedor = (vendedor = '') => {
    return textoSeguro(vendedor, '').replace('Blader (', '').replace(')', '').trim();
  };

  // 🟢 FUNÇÃO CENTRAL: ABRE A PÁGINA DO ANÚNCIO 🟢
  // Importante: agora o clique no anúncio NÃO cria chat automaticamente.
  // Antes, se a criação/busca do chat falhasse no Supabase, parecia que a página sumia.
  const verAnuncio = (anuncio, chatPreExistente = null) => {
    if (!anuncio) {
      console.error('Tentou abrir um anúncio vazio.');
      return;
    }

    const anuncioSeguro = normalizarAnuncio(anuncio);
    setAnuncioSel(anuncioSeguro);
    setChatAtivo(chatPreExistente || null);
    setNovaMsg('');
    setAnuncioAba('detalhes');
    navegar('anuncio', true);
  };

  const iniciarChatDoAnuncio = async () => {
    const anuncioSeguro = normalizarAnuncio(anuncioSel || {});

    if (!usuario) {
      navegar('perfil');
      return null;
    }

    if (!anuncioSeguro.id) {
      alert('Não foi possível iniciar chat: anúncio sem ID.');
      return null;
    }

    const vendedorEhUsuario = anuncioSeguro.vendedor === `Blader (${usuario.nome})`;
    const vendedorAceitaChat = anuncioSeguro.vendedor && anuncioSeguro.vendedor !== 'Oficial';

    if (vendedorEhUsuario || !vendedorAceitaChat) return null;

    const vendedorReal = nomeRealDoVendedor(anuncioSeguro.vendedor);

    try {
      let chatData = null;

      const { data: chatsExistentes, error: chatError } = await supabase
        .from('trade_chats')
        .select('*')
        .eq('produto_id', anuncioSeguro.id)
        .eq('comprador', usuario.nome)
        .limit(1);

      if (chatError) throw chatError;
      chatData = Array.isArray(chatsExistentes) ? chatsExistentes[0] : null;

      if (!chatData) {
        const { data: newChat, error: insertError } = await supabase
          .from('trade_chats')
          .insert([{
            produto_id: anuncioSeguro.id,
            produto_nome: anuncioSeguro.nome,
            comprador: usuario.nome,
            vendedor: vendedorReal
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        chatData = newChat;
      }

      if (chatData) {
        setChatAtivo(chatData);
        setMeusChats(prev => {
          const lista = Array.isArray(prev) ? prev : [];
          return lista.some(c => c?.id === chatData.id) ? lista : [chatData, ...lista];
        });
        return chatData;
      }

      return null;
    } catch(e) {
      console.error('Erro ao conectar chat:', e);
      alert(`Não foi possível iniciar o chat: ${e.message || 'erro no Supabase'}`);
      return null;
    }
  };

  const enviarMsg = async (e) => {
    e.preventDefault();

    const texto = novaMsg.trim();
    if (!texto || !usuario?.nome) return;

    let chatParaEnviar = chatAtivo;

    // Na aba "Fazer pergunta", a primeira mensagem já cria o chat automaticamente.
    if (!chatParaEnviar?.id) {
      chatParaEnviar = await iniciarChatDoAnuncio();
      if (!chatParaEnviar?.id) {
        setNovaMsg(texto);
        return;
      }
    }

    setNovaMsg('');

    const { error } = await supabase.from('chat_messages').insert([{
      chat_id: chatParaEnviar.id,
      remetente: usuario.nome,
      conteudo: texto
    }]);

    if (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert(`Erro ao enviar mensagem: ${error.message}`);
      setNovaMsg(texto);
    }
  };

  useEffect(() => {
    if (vNome) {
      const baseInfo = CATALOGO.find(p => p.nome.toLowerCase() === vNome.toLowerCase());
      if (baseInfo && baseInfo.preco) {
        const fator = CONDICOES_INFO[vCond]?.peso || 1;
        setPrecoSugerido((baseInfo.preco * fator).toFixed(2));
      } else {
        setPrecoSugerido(null);
      }
    }
  }, [vNome, vCond]);

  useEffect(() => { localStorage.setItem('bX_cart', JSON.stringify(carrinho)); }, [carrinho]);
  useEffect(() => { localStorage.setItem('bX_user', JSON.stringify(usuario)); }, [usuario]);

  // NAVEGAÇÃO ATUALIZADA
  const navegar = (p, manterPeca = false) => { 
    if (!manterPeca) { setPecaSel(null); }
    if (p !== 'anuncio') { setAnuncioSel(null); setChatAtivo(null); setAnuncioAba('detalhes'); } // Limpa ao sair da página do anúncio
    setPagina(p); setBusca(''); setFiltroTipo('Todos'); setFiltroSub('Todos'); window.scrollTo(0,0); 
  };

  const calcularFrete = async () => {
    const cepLimpo = cepDestino.replace(/\D/g, '');
    if(cepLimpo.length !== 8) return alert('⚠️ CEP inválido! Digite os 8 números.');
    
    setBuscandoFrete(true); setEnderecoEntrega(null); setDadosFrete(null);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const end = await res.json();
      if(end.erro) throw new Error('CEP não encontrado na base dos Correios.');
      
      setEnderecoEntrega(end);
      const isSP = end.uf === 'SP';
      const isSulSudeste = ['RJ', 'MG', 'ES', 'PR', 'SC', 'RS'].includes(end.uf);
      const taxaVolume = carrinho.reduce((acc, item) => acc + (item.quantidade * 2.50), 0);
      
      const precoPacBase = isSP ? 18.50 : isSulSudeste ? 26.90 : 38.40;
      const precoSedexBase = isSP ? 23.80 : isSulSudeste ? 45.50 : 78.90;
      
      setDadosFrete({
        pac: { nome: 'PAC', valor: precoPacBase + taxaVolume, prazo: isSP ? '3 a 5' : isSulSudeste ? '6 a 9' : '10 a 15' },
        sedex: { nome: 'SEDEX', valor: precoSedexBase + (taxaVolume * 1.5), prazo: isSP ? '1 a 2' : isSulSudeste ? '2 a 4' : '4 a 7' }
      });
      setFreteSel('pac');
    } catch (e) { alert('Erro ao calcular frete: ' + e.message); } 
    finally { setBuscandoFrete(false); }
  };

  const qtdCart = carrinho.reduce((a,p) => a + p.quantidade, 0);
  const totalCart = () => {
    const subtotal = carrinho.reduce((a,p) => a + Number(p.preco) * p.quantidade, 0);
    const valorFrete = freteSel && dadosFrete ? dadosFrete[freteSel].valor : 0;
    return subtotal + valorFrete;
  };

  const addCart = prod => {
    setCarrinho(prev => {
      const ex = prev.find(i => i.id === prod.id);
      return ex ? prev.map(i => i.id === prod.id ? {...i, quantidade: i.quantidade + 1} : i) : [...prev, {...prod, quantidade: 1}];
    });
    alert(`✅ ${prod.nome} adicionado!`);
  };

  const rmCart = id => {
    setCarrinho(p => p.filter(i => i.id !== id));
    if (carrinho.length === 1) setDadosFrete(null);
  };

  const starsBadge = nome => {
    if (nome === 'Oficial') return <span className="oficial-badge">✓ OFICIAL</span>;
    const avs = avaliacoes.filter(a => a.vendedor === nome);
    if (!avs.length) return <span style={{color:'#555',fontSize:'12px',marginLeft:'8px'}}>(Novo)</span>;
    const m = (avs.reduce((a,v) => a + Number(v.nota), 0) / avs.length).toFixed(1);
    return <span className="stars" style={{marginLeft:'8px'}}>★ {m} ({avs.length})</span>;
  };

  const logout = () => { setUsuario(null); setTrans([]); setMeusChats([]); navegar('home'); };

  const uploadImg = async (file, pasta) => {
    const ext = file.name.split('.').pop();
    const hash = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const path = `${pasta}/${hash}.${ext}`;
    const { error } = await supabase.storage.from('imagens').upload(path, file);
    if (error) throw error;
    return supabase.storage.from('imagens').getPublicUrl(path).data.publicUrl;
  };

  const publicar = async (e) => {
    e.preventDefault(); 
    if(!vNome || !vPreco) return alert('Preencha nome e preço!');
    setUploading(true);
    
    try {
      const img = vFile ? await uploadImg(vFile, 'produtos') : getImagem(vNome, vTipo);
      const novoProduto = { nome: vNome, tipo: vTipo, condicao: vCond, descricao: vDesc, preco: parseFloat(vPreco), vendedor: `Blader (${usuario.nome})`, imagem: img };
      const { data: prodData, error: prodErr } = await supabase.from('produtos').insert([novoProduto]).select();
      if(prodErr) throw prodErr;

      await supabase.from('historico_precos').insert([{ produto_id: prodData[0].id, preco_antigo: null, preco_novo: parseFloat(vPreco) }]);
      setMktProd(p => [...p, prodData[0]]); 
      alert('✅ Anúncio publicado!');
      setVNome(''); setVPreco(''); setVDesc(''); setVFile(null); setVCond('Novo na embalagem');
    } catch (err) { alert(`Erro: ${err.message}`); } finally { setUploading(false); }
  };

  const excluirAnuncioPerfil = async (produto) => {
    if (!usuario) return alert('Faça login para excluir seus anúncios.');
    if (!produto || !produto.id) return alert('Anúncio inválido ou não encontrado.');

    const vendedorEsperado = `Blader (${usuario.nome})`;
    if (produto.vendedor !== vendedorEsperado) {
      return alert('Você só pode excluir anúncios publicados pela sua própria conta.');
    }

    const confirmar = window.confirm(
      `Excluir definitivamente o anúncio "${produto.nome}"?\n\nEssa ação remove o anúncio do marketplace e não pode ser desfeita.`
    );
    if (!confirmar) return;

    setRemovendoAnuncioId(produto.id);

    try {
      const produtoId = produto.id;

      // 1) Remove dados ligados ao anúncio, sem travar a exclusão caso alguma tabela não exista
      // ou esteja sem permissão. O erro fica no console para facilitar o diagnóstico.
      let chatIds = [];

      const { data: chats, error: chatsBuscaErro } = await supabase
        .from('trade_chats')
        .select('id')
        .eq('produto_id', produtoId);

      if (!chatsBuscaErro && Array.isArray(chats)) {
        chatIds = chats.map(c => c.id).filter(Boolean);
      } else if (chatsBuscaErro) {
        console.warn('Não foi possível buscar chats do anúncio:', chatsBuscaErro);
      }

      if (chatIds.length > 0) {
        const { error: mensagensErro } = await supabase
          .from('chat_messages')
          .delete()
          .in('chat_id', chatIds);

        if (mensagensErro) console.warn('Não foi possível remover mensagens do anúncio:', mensagensErro);

        const { error: chatsErro } = await supabase
          .from('trade_chats')
          .delete()
          .in('id', chatIds);

        if (chatsErro) console.warn('Não foi possível remover chats do anúncio:', chatsErro);
      }

      const { error: historicoErro } = await supabase
        .from('historico_precos')
        .delete()
        .eq('produto_id', produtoId);

      if (historicoErro) console.warn('Não foi possível remover histórico de preços:', historicoErro);

      // 2) Remove o anúncio principal. Esse é o botão EXCLUIR da aba Perfil > Anúncios.
      const { error: produtoErro, count } = await supabase
        .from('produtos')
        .delete({ count: 'exact' })
        .eq('id', produtoId)
        .eq('vendedor', vendedorEsperado);

      if (produtoErro) throw produtoErro;

      if (count === 0) {
        throw new Error('Nenhum anúncio foi removido. Verifique se o id/vendedor está correto ou se o Supabase RLS está bloqueando DELETE.');
      }

      // 3) Atualiza a tela Perfil > Anúncios na hora, sem precisar recarregar.
      setMktProd(prev => prev.filter(x => String(x.id) !== String(produtoId)));
      setCarrinho(prev => prev.filter(x => String(x.id) !== String(produtoId)));
      setMeusChats(prev => prev.filter(c => String(c.produto_id) !== String(produtoId)));

      if (anuncioSel && String(anuncioSel.id) === String(produtoId)) {
        setAnuncioSel(null);
        setChatAtivo(null);
        setPagina('marketplace');
      }

      alert('✅ Anúncio excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir anúncio do perfil:', err);
      alert(
        `❌ Não foi possível excluir o anúncio: ${err.message || 'erro desconhecido'}\n\n` +
        'Se o anúncio sumir e voltar ao recarregar, o problema é permissão DELETE/RLS no Supabase.'
      );
    } finally {
      setRemovendoAnuncioId(null);
    }
  };

  // Mantém compatibilidade caso algum outro botão antigo ainda chame rmAnuncio(id).
  const rmAnuncio = async (id) => {
    const produto = mktProd.find(p => String(p.id) === String(id));
    return excluirAnuncioPerfil(produto);
  };

  const salvarFoto = async () => {
    if(!cfgFile) return alert('Selecione uma imagem!');
    setUploading(true);
    try {
      const url = await uploadImg(cfgFile, 'perfil');
      await supabase.from('usuarios').update({foto: url}).eq('id', usuario.id);
      setUsuario({...usuario, foto: url}); alert('Foto atualizada!'); setCfgFile(null);
    } catch (err) { alert(`Erro: ${err.message}`); } finally { setUploading(false); }
  };

  const confirmarRec = async (id, vendedor) => {
    const nota = prompt(`Avalie ${vendedor} (1 a 5):`);
    if(!nota || isNaN(nota) || nota < 1 || nota > 5) return alert('Nota inválida.');
    try {
      const av = { vendedor, comprador: usuario.nome, nota: parseInt(nota), data: new Date().toLocaleString('pt-BR') };
      await supabase.from('avaliacoes').insert([av]);
      await supabase.from('transacoes').update({avaliado: true}).eq('id', id);
      setAval(p => [...p, av]); setTrans(p => p.map(t => t.id === id ? {...t, avaliado: true} : t));
      alert('Avaliação salva!');
    } catch(e) { alert("Erro ao salvar avaliação."); }
  };

  const checkout = async () => {
    if(!usuario) { navegar('perfil'); return alert('Faça login primeiro!'); }
    try {
      const novas = carrinho.map(i => ({ comprador: usuario.nome, vendedor: i.vendedor, nome_peca: i.nome, preco: Number(i.preco), quantidade: i.quantidade, imagem: i.imagem || getImagem(i.nome, i.tipo), data: new Date().toLocaleString('pt-BR'), avaliado: false, status_pagamento: 'concluido' }));
      const { data, error } = await supabase.from('transacoes').insert(novas).select();
      if(error) throw error;
      setTrans(prev => [...prev, ...data]); setCarrinho([]); setDadosFrete(null); alert('✅ Compra registrada!');
      navegar('perfil'); setPerfilTab('compras');
    } catch (e) { alert("Erro ao processar checkout."); }
  };

  const getSubtipos = () => { if(filtroTipo !== 'Combo') return []; return ['Todos', ...new Set(CATALOGO.filter(p => p.tipo === 'Combo' && p.subtipo).map(p => p.subtipo))]; };
  const filtrar = lista => lista.filter(p => { const tOk = filtroTipo === 'Todos' || p.tipo === filtroTipo; const sOk = filtroSub === 'Todos' || !p.subtipo || p.subtipo === filtroSub; const bOk = !busca || p.nome.toLowerCase().includes(busca.toLowerCase()) || (p.descricao || '').toLowerCase().includes(busca.toLowerCase()); return tOk && sOk && bOk; });


  // ================= RENDER FUNCTIONS ================= //
  
  // 🟢 NOVA PÁGINA: DETALHE DO ANÚNCIO + CHAT (TELA DIVIDIDA) 🟢
  const renderAnuncio = () => {
    if (!anuncioSel) {
      return (
        <div className="loading-screen">
          <div className="loading-spinner"/>
          <p>Carregando anúncio...</p>
          <button className="btn btn-ghost btn-sm" onClick={() => navegar('marketplace', true)}>Voltar ao marketplace</button>
        </div>
      );
    }

    const anuncio = normalizarAnuncio(anuncioSel);
    const condInfo = CONDICOES_INFO[anuncio.condicao] || CONDICOES_INFO['Usado'];
    const usuarioNome = textoSeguro(usuario?.nome, '');
    const isVendedor = Boolean(usuarioNome && anuncio.vendedor === `Blader (${usuarioNome})`);
    const chatDisponivel = Boolean(usuarioNome && !isVendedor && anuncio.vendedor !== 'Oficial');
    const textoVoltar = typeof pecaSel === 'string' && pecaSel.trim() ? pecaSel : 'o Marketplace';
    const tabAtiva = anuncioAba === 'pergunta' ? 'pergunta' : 'detalhes';

    const tabBtn = (id, label) => (
      <button
        type="button"
        onClick={() => setAnuncioAba(id)}
        style={{
          flex: 1,
          padding: '14px 18px',
          borderRadius: '12px',
          border: id === tabAtiva ? '1px solid var(--primary)' : '1px solid #333',
          background: id === tabAtiva ? 'var(--primary)' : '#111',
          color: '#fff',
          fontWeight: '900',
          letterSpacing: '0.5px',
          cursor: 'pointer',
          textTransform: 'uppercase'
        }}
      >
        {label}
      </button>
    );

    const renderCaixaPergunta = () => {
      if (!usuario) {
        return (
          <div style={{background:'#111', padding:'30px', borderRadius:'16px', textAlign:'center', minHeight:'420px', display:'flex', flexDirection:'column', justifyContent:'center', border:'1px solid #333'}}>
            <div className="icon" style={{fontSize:'40px', marginBottom:'20px'}}>💬</div>
            <h3 style={{marginBottom:'10px'}}>Fazer pergunta</h3>
            <p style={{color:'#888', marginBottom:'20px'}}>Faça login para mandar uma mensagem direta para o vendedor deste anúncio.</p>
            <button className="btn" onClick={()=>navegar('perfil')}>Fazer Login</button>
          </div>
        );
      }

      if (isVendedor) {
        return (
          <div style={{background:'#111', padding:'30px', borderRadius:'16px', textAlign:'center', minHeight:'420px', display:'flex', flexDirection:'column', justifyContent:'center', border:'1px solid #333'}}>
            <div className="icon" style={{fontSize:'40px', marginBottom:'20px'}}>📦</div>
            <h3 style={{marginBottom:'10px'}}>Este é o seu anúncio</h3>
            <p style={{color:'#888'}}>Quando alguém fizer uma pergunta, a conversa aparecerá na aba <b>💬 Mensagens</b> do seu Perfil.</p>
          </div>
        );
      }

      if (!chatDisponivel) {
        return (
          <div style={{background:'#111', padding:'30px', borderRadius:'16px', textAlign:'center', minHeight:'420px', display:'flex', flexDirection:'column', justifyContent:'center', border:'1px solid #333'}}>
            <div className="icon" style={{fontSize:'40px', marginBottom:'20px'}}>ℹ️</div>
            <h3 style={{marginBottom:'10px'}}>Pergunta indisponível</h3>
            <p style={{color:'#888'}}>Este anúncio não possui um vendedor válido para receber mensagens.</p>
          </div>
        );
      }

      return (
        <div style={{background:'#111', borderRadius:'16px', display:'flex', flexDirection:'column', minHeight:'600px', border:'1px solid #333', overflow:'hidden'}}>
          <div style={{background:'var(--primary)', color:'#fff', padding:'20px', fontWeight:'bold', fontSize:'18px'}}>
            💬 Fazer pergunta ao vendedor
            <div style={{fontSize:'12px', opacity:0.85, marginTop:'6px', fontWeight:'normal'}}>Sua primeira mensagem cria o chat automaticamente.</div>
          </div>

          <div style={{padding:'18px 20px', background:'#161616', borderBottom:'1px solid #333', color:'#aaa', fontSize:'14px'}}>
            <strong style={{color:'#fff'}}>Anúncio:</strong> {anuncio.nome}<br/>
            <strong style={{color:'#fff'}}>Vendedor:</strong> {anuncio.vendedor}
          </div>

          {/* Área de Mensagens */}
          <div style={{flex:1, overflowY:'auto', padding:'20px', display:'flex', flexDirection:'column', gap:'15px', background:'#0a0a0a'}}>
            {mensagensChat.length === 0 ? (
              <div style={{margin:'auto', color:'#666', textAlign:'center', lineHeight:'1.6'}}>
                Escreva sua pergunta abaixo.<br/>Exemplo: “Ainda está disponível?” ou “Consegue melhorar o preço?”
              </div>
            ) : (
              mensagensChat.map((m, idx) => {
                const remetente = textoSeguro(m?.remetente, 'Usuário');
                const conteudo = textoSeguro(m?.conteudo, '');
                const isMe = remetente === usuarioNome;
                return (
                  <div key={m?.id || idx} style={{padding:'12px 16px', borderRadius:'12px', maxWidth:'80%', alignSelf: isMe ? 'flex-end' : 'flex-start', background: isMe ? 'var(--primary)' : '#222', color: '#fff', fontSize:'14px', lineHeight:'1.5'}}>
                    {!isMe && <span style={{fontSize:'11px', opacity:0.6, display:'block', marginBottom:'6px', fontWeight:'bold'}}>{remetente}</span>}
                    {conteudo || <i style={{opacity:0.6}}>Mensagem vazia</i>}
                  </div>
                )
              })
            )}
          </div>

          {/* Input de Envio */}
          <form onSubmit={enviarMsg} style={{display:'flex', gap:'10px', padding:'15px', background:'#1a1a1a', borderTop:'1px solid #333', alignItems:'center'}}>
            <input
              type="text"
              value={novaMsg}
              onChange={e=>setNovaMsg(e.target.value)}
              placeholder="Digite sua pergunta para o vendedor..."
              style={{flex:1, padding:'12px 18px', background:'#111', border:'1px solid #444', borderRadius:'25px', outline:'none', color:'#fff', fontSize:'14px'}}
            />
            <button
              type="submit"
              className="btn"
              style={{borderRadius:'25px', padding:'12px 22px', whiteSpace:'nowrap'}}
              disabled={!novaMsg.trim()}
            >
              ENVIAR
            </button>
          </form>
        </div>
      );
    };

    return (
      <div style={{maxWidth:'1200px', margin:'0 auto', width:'100%'}}>
        <button className="btn btn-ghost btn-sm" style={{marginBottom:'18px'}} onClick={() => navegar('marketplace', true)}>← Voltar para {textoVoltar}</button>

        <div style={{display:'flex', gap:'12px', marginBottom:'24px', background:'#0a0a0a', border:'1px solid #222', padding:'10px', borderRadius:'16px'}}>
          {tabBtn('detalhes', '📦 Detalhes do anúncio')}
          {tabBtn('pergunta', '💬 Fazer pergunta')}
        </div>

        {tabAtiva === 'detalhes' ? (
          <div style={{display:'flex', gap:'30px', flexWrap:'wrap', width:'100%'}}>
            <div style={{flex:'1 1 430px', background:'#111', padding:'30px', borderRadius:'16px', height:'fit-content', border:'1px solid #222'}}>
              <div style={{background:'#222', borderRadius:'12px', padding:'20px', textAlign:'center', marginBottom:'20px'}}>
                <ProdImg nome={anuncio.nome} tipo={anuncio.tipo} customSrc={anuncio.imagem} style={{maxWidth:'100%', maxHeight:'320px', objectFit:'contain'}} />
              </div>

              <h1 style={{fontSize:'32px', marginBottom:'10px'}}>{anuncio.nome}</h1>
              <p style={{fontSize:'28px', color:'var(--primary)', fontWeight:'bold', marginBottom:'20px'}}>R$ {Number(anuncio.preco).toFixed(2)}</p>

              <div style={{background:'#1a1a1a', padding:'20px', borderRadius:'12px', color:'#aaa', marginBottom:'20px'}}>
                <p style={{marginBottom:'10px'}}><strong style={{color:'#fff'}}>Vendedor:</strong> {anuncio.vendedor} {starsBadge(anuncio.vendedor)}</p>
                <div style={{marginBottom:'10px', display:'flex', alignItems:'center', flexWrap:'wrap', gap:'8px'}}>
                  <strong style={{color:'#fff'}}>Estado:</strong>
                  <span style={{background: condInfo.badge, color: condInfo.textoCor, padding:'3px 8px', borderRadius:'6px', fontSize:'11px', fontWeight:'bold'}}>{condInfo.icone} {anuncio.condicao}</span>
                </div>
                {anuncio.descricao && <p style={{marginTop:'10px'}}><strong style={{color:'#fff'}}>Descrição:</strong> {anuncio.descricao}</p>}
              </div>

              <button className="btn" style={{width:'100%', padding:'15px', borderRadius:'8px', fontSize:'16px'}} onClick={()=>addCart(normalizarAnuncio(anuncio))}>ADICIONAR AO CARRINHO 🛒</button>
            </div>

            <div style={{flex:'1 1 320px', background:'#111', padding:'30px', borderRadius:'16px', height:'fit-content', border:'1px solid #222'}}>
              <h3 style={{marginBottom:'12px'}}>Tem dúvida sobre o anúncio?</h3>
              <p style={{color:'#888', lineHeight:'1.6', marginBottom:'20px'}}>Use a aba <b>Fazer pergunta</b> para mandar uma mensagem direta para o vendedor. O chat será criado automaticamente quando você enviar a primeira pergunta.</p>
              <button className="btn" style={{width:'100%', borderRadius:'8px', padding:'14px'}} onClick={() => setAnuncioAba('pergunta')}>💬 FAZER PERGUNTA</button>
            </div>
          </div>
        ) : (
          <div style={{display:'flex', gap:'30px', flexWrap:'wrap', width:'100%'}}>
            <div style={{flex:'0 1 330px', background:'#111', padding:'24px', borderRadius:'16px', height:'fit-content', border:'1px solid #222'}}>
              <div style={{background:'#222', borderRadius:'12px', padding:'16px', textAlign:'center', marginBottom:'16px'}}>
                <ProdImg nome={anuncio.nome} tipo={anuncio.tipo} customSrc={anuncio.imagem} style={{maxWidth:'100%', maxHeight:'180px', objectFit:'contain'}} />
              </div>
              <h2 style={{fontSize:'22px', marginBottom:'8px'}}>{anuncio.nome}</h2>
              <p style={{fontSize:'22px', color:'var(--primary)', fontWeight:'bold', marginBottom:'14px'}}>R$ {Number(anuncio.preco).toFixed(2)}</p>
              <p style={{color:'#aaa', fontSize:'14px', marginBottom:'8px'}}><strong style={{color:'#fff'}}>Vendedor:</strong> {anuncio.vendedor}</p>
              <button className="btn btn-ghost btn-sm" style={{marginTop:'14px', width:'100%'}} onClick={() => setAnuncioAba('detalhes')}>Ver detalhes do anúncio</button>
            </div>

            <div style={{flex:'1 1 500px'}}>
              {renderCaixaPergunta()}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ---------------------------------------------------

  const renderHome = () => (
    <>
      <div className="hero">
        <BeySpinner style={{position:'absolute',right:'-60px',top:'50%',transform:'translateY(-50%)',opacity:0.06,animation:'spinSlow 12s linear infinite',pointerEvents:'none'}}/>
        <div className="hero-eyebrow">⚡ Beyblade X — Liga Oficial Brasil</div>
        <h1><span>LIGA</span> BEYBLADE</h1>
        <p className="hero-sub">Ecossistema profissional. Gráficos de mercado, auto-precificação, frete integrado e catálogo completo.</p>
        <div className="hero-btns">
          <button className="btn" onClick={()=>navegar('catalogo')}>📚 Catálogo ({CATALOGO.length} peças)</button>
          <button className="btn btn-outline" onClick={()=>navegar('marketplace')}>🛒 Marketplace Avançado</button>
        </div>
      </div>
      <div className="features-grid">
        <div className="feature-box"><i className="fa-solid fa-chart-line"></i><h3>Dashboard Financeiro</h3><p>Gráficos de evolução de preço e média de mercado.</p></div>
        <div className="feature-box"><i className="fa-solid fa-truck-fast"></i><h3>Frete Inteligente</h3><p>Cálculo em tempo real de SEDEX e PAC via Correios.</p></div>
        <div className="feature-box"><i className="fa-solid fa-user-check"></i><h3>Ranking Verificado</h3><p>Transações seguras e reputação real na comunidade.</p></div>
      </div>
      <div className="section-header" style={{marginTop:'60px'}}><div><h2>🔥 Destaques do <span>Catálogo</span></h2></div><button className="btn btn-ghost btn-sm" onClick={()=>navegar('catalogo')}>Ver todos →</button></div>
      <div className="grid">
        {CATALOGO.filter(p=>p.tipo==='Combo').slice(0,8).map((p,i)=>(
          <div
            key={p.id}
            className={`card tipo-${p.tipo.toLowerCase()}`}
            style={{animationDelay:`${i*0.06}s`,cursor:'pointer'}}
            onClick={()=>{setPecaSel(p.nome); navegar('marketplace', true);}}
          >
            <span className="badge-tipo">{p.subtipo||p.tipo}</span>
            {p.raro&&<span className="badge-count" style={{background:'linear-gradient(90deg,#ffd700,#ff8800)'}}>RARO</span>}
            <div className="img-wrapper"><ProdImg nome={p.nome} tipo={p.tipo} style={{height:'155px',objectFit:'contain',padding:'8px'}}/></div>
            <h3>{p.nome}</h3>
            <span className="preco">R$ {p.preco.toFixed(2)}</span>
            <button className="btn btn-sm" style={{width:'100%',borderRadius:'50px'}} onClick={(e)=>{e.stopPropagation(); setPecaSel(p.nome); navegar('marketplace', true);}}>PÁGINA DO PRODUTO</button>
          </div>
        ))}
      </div>
    </>
  );

  const renderCatalogo = () => {
    const filtrado = filtrar(CATALOGO); const subtipos = getSubtipos();
    return (
      <div>
        <div className="section-header"><div><h2>📚 Catálogo <span>Oficial</span></h2><p style={{marginTop:4}}>{filtrado.length} / {CATALOGO.length} itens</p></div></div>
        <div className="search-bar">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Buscar no site (peças, anúncios...)" value={busca} onChange={ev=>setBusca(ev.target.value)} />
          {busca && <button className="btn btn-ghost btn-sm" style={{whiteSpace:'nowrap',padding:'4px 12px'}} onClick={()=>setBusca('')}>✕</button>}
        </div>

        <div className="filter-row">{TIPOS.map(t=>(<button key={t} className={`filter-btn ${filtroTipo===t?'ativo':''}`} onClick={()=>{setFiltroTipo(t);setFiltroSub('Todos');}}>{t}</button>))}</div>
        {subtipos.length>1&&(<div className="filter-row" style={{marginTop:'-12px',marginBottom:'20px'}}>{subtipos.map(s=>(<button key={s} className={`filter-btn ${filtroSub===s?'ativo':''}`} style={{fontSize:'10px',padding:'5px 12px'}} onClick={()=>setFiltroSub(s)}>{s}</button>))}</div>)}
        {filtrado.length===0 ? <div className="empty-state"><div className="icon">🔍</div><h3>Nenhum resultado</h3></div>
          :<div className="grid">
            {filtrado.map((p,i)=>(
              <div key={p.id} className={`card tipo-${p.tipo.toLowerCase()}`} style={{animationDelay:`${Math.min(i,20)*0.04}s`}}>
                <span className="badge-tipo">{p.subtipo||p.tipo}</span>{p.raro&&<span className="badge-count" style={{background:'linear-gradient(90deg,#ffd700,#ff8800)'}}>RARO</span>}
                <div className="img-wrapper"><ProdImg nome={p.nome} tipo={p.tipo} style={{height:'155px',objectFit:'contain',cursor:'pointer',padding:'8px'}} onClick={()=>setLightbox(getImagem(p.nome,p.tipo))}/></div>
                <h3>{p.nome}</h3><p style={{color:'#555',fontSize:'11px',marginBottom:'8px',lineHeight:'1.4'}}>{p.descricao}</p>
                <span className="preco" style={{fontSize:'18px'}}>R$ {p.preco.toFixed(2)} <span className="preco-ref">ref.</span></span>
                <button className="btn btn-ghost btn-sm" style={{width:'100%',borderRadius:'50px',marginTop:'4px'}} onClick={()=>{setPecaSel(p.nome); navegar('marketplace', true);}}>PÁGINA DO PRODUTO</button>
              </div>
            ))}
          </div>
        }
      </div>
    );
  };

  const renderMarketplace = () => {
    if(pecaSel){
      let ofertas = [...mktProd.filter(p => (p.nome || '').trim().toLowerCase() === (pecaSel || '').trim().toLowerCase())];
      ofertas.sort((a,b) => ordenacao === 'menor_preco' ? a.preco - b.preco : b.preco - a.preco);
      
      const base = CATALOGO.find(p => (p.nome || '').trim().toLowerCase() === (pecaSel || '').trim().toLowerCase()) || {};
      
      const ofertasValidas = ofertas.filter(o => !isNaN(Number(o.preco)) && Number(o.preco) > 0);
      const menorPreco = ofertasValidas.length > 0 ? Math.min(...ofertasValidas.map(o => Number(o.preco))) : null;
      const maiorPreco = ofertasValidas.length > 0 ? Math.max(...ofertasValidas.map(o => Number(o.preco))) : null;
      const mediaMercado = ofertasValidas.length > 0 ? ofertasValidas.reduce((a,b)=>a+Number(b.preco),0)/ofertasValidas.length : (base.preco || 0);
      
      const variacao = (menorPreco && maiorPreco && menorPreco > 0) ? (((maiorPreco - menorPreco) / menorPreco) * 100).toFixed(0) : 0;

      const dataGrafico = ofertasValidas.length > 0 ? [
        { data: 'Há 15 dias', preco: Number((mediaMercado * 1.15).toFixed(2)) },
        { data: 'Há 7 dias', preco: Number((mediaMercado * 1.05).toFixed(2)) },
        { data: 'Hoje', preco: Number(mediaMercado.toFixed(2)) }
      ] : [];

      // Gráfico simples em SVG para evitar erro do Recharts/React: "Invalid hook call / useContext null".
      const chartValores = dataGrafico.map(d => Number(d.preco)).filter(v => Number.isFinite(v));
      const chartMin = chartValores.length ? Math.min(...chartValores) : 0;
      const chartMax = chartValores.length ? Math.max(...chartValores) : 1;
      const chartRange = chartMax - chartMin || 1;
      const chartPoints = dataGrafico.map((d, idx) => {
        const x = 42 + (idx * 128);
        const y = 112 - (((Number(d.preco) - chartMin) / chartRange) * 74);
        return `${x},${y}`;
      }).join(' ');

      return(
        <div className="marketplace-avancado">
          <button className="btn btn-ghost btn-sm" style={{marginBottom:'24px'}} onClick={()=>setPecaSel(null)}>← Voltar para listagem</button>
          
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'30px'}}>
            
            <div className="painel-grafico">
              <div style={{background:'#111', borderRadius:'16px', padding:'20px', textAlign:'center', position:'relative'}}>
                {base.subtipo && <span className="badge-tipo" style={{position:'absolute', top:'10px', left:'10px'}}>{base.subtipo}</span>}
                <ProdImg nome={pecaSel} tipo={base.tipo||'Combo'} style={{maxWidth:'100%', maxHeight:'280px', filter:'drop-shadow(0 20px 40px rgba(255,30,30,0.3))'}} />
              </div>

              <div style={{marginTop:'20px', background:'#1a1a1a', padding:'20px', borderRadius:'16px'}}>
                <h4 style={{marginBottom:'16px', fontSize:'14px', color:'#fff'}}>📊 Resumo do Mercado</h4>
                <div style={{display:'flex', gap:'10px', justifyContent:'space-between', marginBottom:'20px'}}>
                  <div style={{background:'#222', padding:'10px', borderRadius:'8px', flex:1, textAlign:'center'}}>
                    <span style={{display:'block', fontSize:'11px', color:'#888', marginBottom:'4px'}}>Menor Preço</span>
                    <strong style={{color:'#10b981', fontSize:'16px'}}>R$ {menorPreco ? menorPreco.toFixed(2) : '---'}</strong>
                  </div>
                  <div style={{background:'#222', padding:'10px', borderRadius:'8px', flex:1, textAlign:'center'}}>
                    <span style={{display:'block', fontSize:'11px', color:'#888', marginBottom:'4px'}}>Maior Preço</span>
                    <strong style={{color:'#ef4444', fontSize:'16px'}}>R$ {maiorPreco ? maiorPreco.toFixed(2) : '---'}</strong>
                  </div>
                  <div style={{background:'#222', padding:'10px', borderRadius:'8px', flex:1, textAlign:'center'}}>
                    <span style={{display:'block', fontSize:'11px', color:'#888', marginBottom:'4px'}}>Variação Máx.</span>
                    <strong style={{color:'#f59e0b', fontSize:'16px'}}>{variacao}%</strong>
                  </div>
                </div>

                <h4 style={{marginBottom:'16px', fontSize:'14px', color:'#aaa'}}>📉 Histórico de Preço Médio</h4>
                {ofertasValidas.length > 0 ? (
                  <div style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
                    <div style={{ minWidth: '340px' }}>
                      <svg width="340" height="150" viewBox="0 0 340 150" role="img" aria-label="Histórico de preço médio" style={{display:'block'}}>
                        <line x1="36" y1="38" x2="36" y2="118" stroke="#333" strokeWidth="1" />
                        <line x1="36" y1="118" x2="310" y2="118" stroke="#333" strokeWidth="1" />
                        <line x1="36" y1="78" x2="310" y2="78" stroke="#222" strokeWidth="1" strokeDasharray="4 4" />
                        <polyline points={chartPoints} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        {dataGrafico.map((d, idx) => {
                          const x = 42 + (idx * 128);
                          const y = 112 - (((Number(d.preco) - chartMin) / chartRange) * 74);
                          return (
                            <g key={d.data}>
                              <circle cx={x} cy={y} r="5" fill="var(--primary)" />
                              <text x={x} y={y - 12} textAnchor="middle" fill="#ddd" fontSize="11">R$ {Number(d.preco).toFixed(2)}</text>
                              <text x={x} y="138" textAnchor="middle" fill="#888" fontSize="10">{d.data}</text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                ) : <p style={{color:'#666', fontSize:'13px', textAlign:'center'}}>Sem histórico suficiente.</p>}
              </div>
            </div>

            <div className="lista-ofertas">
              <h1 style={{fontSize:'clamp(2rem,4vw,2.5rem)', marginBottom:'8px'}}>{pecaSel}</h1>
              <p style={{color:'#888', marginBottom:'20px'}}>Preço Base Oficial de Lançamento: <strong style={{color:'#fff'}}>R$ {base.preco?.toFixed(2)}</strong></p>
              
              <div style={{display:'flex', gap:'10px', marginBottom:'20px', alignItems:'center'}}>
                <select value={ordenacao} onChange={ev=>setOrdenacao(ev.target.value)} style={{background:'#222', color:'#fff', border:'1px solid #333', padding:'8px 16px', borderRadius:'8px', cursor:'pointer'}}>
                  <option value="menor_preco">⬇️ Ordenar: Mais Baratos</option>
                  <option value="maior_preco">⬆️ Ordenar: Mais Caros</option>
                </select>
                <div style={{fontSize:'12px', color:'#666'}}>{ofertas.length} anúncio(s) ativo(s) nesta página</div>
              </div>

              {ofertas.length === 0 ? (
                <div className="empty-state" style={{background:'#111', borderRadius:'16px', padding:'40px 20px'}}><h3>Nenhum anúncio disponível no momento.</h3><p style={{fontSize:'13px'}}>Seja o primeiro a vender essa peça!</p></div>
              ) : (
                <div className="tabela-anuncios">
                  {ofertas.map(o => {
                    const condNormalizada = CONDICOES_INFO[o.condicao] ? o.condicao : 'Usado';
                    const infoCond = CONDICOES_INFO[condNormalizada];
                    const diffM = mediaMercado > 0 ? (((o.preco - mediaMercado) / mediaMercado) * 100).toFixed(0) : 0;
                    const isMelhor = Number(o.preco) === menorPreco;

                    return (
                      // 🟢 AGORA CLICAR NO CARD INTEIRO ABRE A PÁGINA DO ANÚNCIO 🟢
                      <div key={o.id} onClick={() => verAnuncio(normalizarAnuncio(o))} style={{cursor:'pointer', border:`1px solid ${isMelhor ? 'var(--primary)' : '#333'}`, padding:'16px', borderRadius:'12px', marginBottom:'12px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#111', transition:'transform 0.2s'}} className="hover-lift">
                        <div style={{display:'flex', gap:'16px', alignItems:'center'}}>
                          <div style={{width:'60px', height:'60px', background:'#222', borderRadius:'8px', padding:'5px'}}><ProdImg nome={o.nome} tipo={o.tipo} customSrc={o.imagem} style={{width:'100%', height:'100%', objectFit:'contain'}}/></div>
                          <div>
                            <div style={{display:'flex', gap:'8px', alignItems:'center', marginBottom:'6px'}}>
                              <strong style={{fontSize:'15px', fontFamily:"'Rajdhani',sans-serif"}}>{o.vendedor}</strong>{starsBadge(o.vendedor)}
                            </div>
                            <div style={{display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap'}}>
                              <span style={{background: infoCond.badge, color: infoCond.textoCor, padding:'3px 8px', borderRadius:'6px', fontSize:'11px', fontWeight:'bold'}}>{infoCond.icone} {condNormalizada}</span>
                              {isMelhor && <span style={{background:'rgba(255,30,30,0.1)', border:'1px solid var(--primary)', color:'var(--primary)', padding:'2px 8px', borderRadius:'6px', fontSize:'10px', fontWeight:'bold'}}>🔥 MELHOR PREÇO</span>}
                            </div>
                          </div>
                        </div>
                        <div style={{textAlign:'right'}}>
                          <h3 style={{color: isMelhor ? 'var(--primary)' : '#fff', margin:0, fontSize:'22px'}}>R$ {Number(o.preco).toFixed(2)}</h3>
                          <div style={{fontSize:'11px', color: diffM > 0 ? '#ef4444' : '#10b981', marginTop:'4px', marginBottom:'8px'}}>
                            {diffM > 0 ? `▲ ${diffM}% acima da média` : diffM < 0 ? `▼ ${Math.abs(diffM)}% abaixo da média` : 'Na média justa'}
                          </div>

                          <button className="btn btn-sm" style={{borderRadius:'50px', padding:'6px 20px', fontSize:'11px'}} onClick={(e)=>{ e.stopPropagation(); addCart(normalizarAnuncio(o)); }}>ADICIONAR 🛒</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    const filt = mktProd.filter(p => {
      const nome = (p?.nome || '').toString().trim();
      const tipo = (p?.tipo || '').toString().trim();
      const precoNum = Number(p?.preco);

      if (!nome) return false;
      if (!tipo) return false;
      if (!Number.isFinite(precoNum) || precoNum <= 0) return false;

      const buscaOk = !busca || nome.toLowerCase().includes(busca.toLowerCase());
      const tipoOk = filtroTipo === 'Todos' || tipo === filtroTipo;
      return buscaOk && tipoOk;
    });

    const grupos = filt.reduce((acc, p) => {
      const nome = (p.nome || '').toString().trim();
      const tipo = (p.tipo || '').toString().trim();
      const k = nome.toLowerCase();
      const precoNum = Number(p.preco);

      if (!acc[k]) acc[k] = { nome, tipo, soma: 0, qtd: 0, imagemDestaque: p.imagem };
      acc[k].soma += precoNum;
      acc[k].qtd += 1;
      return acc;
    }, {});


    return(
      <div>
        <div className="section-header">
          <div><h2>🛒 Market<span>place</span></h2><p style={{marginTop:4}}>{Object.keys(grupos).length} peças disponíveis</p></div>
          {usuario&&<button className="btn btn-sm" onClick={()=>{navegar('perfil');setPerfilTab('anuncios');}}>+ Anunciar</button>}
        </div>
        
        <div className="search-bar">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Buscar peças..." value={busca} onChange={ev=>setBusca(ev.target.value)}/>
          {busca && <button className="btn btn-ghost btn-sm" style={{whiteSpace:'nowrap',padding:'4px 12px'}} onClick={()=>setBusca('')}>✕</button>}
        </div>

        <div className="filter-row">{TIPOS.map(t=>(<button key={t} className={`filter-btn ${filtroTipo===t?'ativo':''}`} onClick={()=>setFiltroTipo(t)}>{t}</button>))}</div>
        
        {Object.keys(grupos).length===0 ? <div className="empty-state"><div className="icon">🌪️</div><h3>Nenhuma oferta encontrada</h3></div>
          :<div className="grid">
            {Object.values(grupos).map((g,i)=>(
              <div key={g.nome} className={`card tipo-${g.tipo.toLowerCase()}`} style={{cursor:'pointer',animationDelay:`${Math.min(i,20)*0.05}s`}} onClick={()=>{setPecaSel(g.nome); navegar('marketplace', true);}}>
                <span className="badge-tipo">{g.tipo}</span><span className="badge-count">{g.qtd} anúncio{g.qtd>1?'s':''}</span>
                <div className="img-wrapper"><ProdImg nome={g.nome} tipo={g.tipo} customSrc={g.imagemDestaque} style={{height:'155px',objectFit:'contain',padding:'8px'}}/></div>
                <h3>{g.nome}</h3><span className="preco">Média: R$ {(g.soma/g.qtd).toFixed(2)}</span>
                <button className="btn btn-sm" style={{width:'100%',borderRadius:'50px'}}>VER ANÚNCIOS</button>
              </div>
            ))}
          </div>
        }
      </div>
    );
  };

  const renderPerfil = () => {
    if(!usuario) return <AuthForm setUsuario={setUsuario} />;
    if (profileLoading) return <div className="loading-screen"><div className="loading-spinner"/><p>Carregando anúncios...</p></div>;
    const meusProd = mktProd.filter(p=>p.vendedor===`Blader (${usuario.nome})`);

    const compras  = transacoes.filter(t=>t.comprador===usuario.nome);
    const vendas   = transacoes.filter(t=>t.vendedor===`Blader (${usuario.nome})`);

    return(
      <div>
        <div className="perfil-header">
          <div className="avatar">{usuario.foto?<img src={usuario.foto} alt="" onError={ev=>{ev.currentTarget.style.display='none';}}/> : usuario.nome[0].toUpperCase()}</div>
          <div style={{flex:1}}><div className="perfil-nome">Blader {usuario.nome}<span className="perfil-badge">✓ Verificado</span></div><p style={{color:'#444',fontSize:'13px',marginTop:'2px'}}>Painel de Controle</p></div>
          <button className="btn btn-ghost btn-sm" onClick={logout} style={{borderRadius:'50px'}}>Sair</button>
        </div>
        
        <div className="perfil-tabs">
          {[{id:'anuncios',l:'📦 Anúncios'},{id:'compras',l:'🛒 Compras'},{id:'vendas',l:'💰 Vendas'},{id:'chats',l:'💬 Mensagens'},{id:'cfg',l:'⚙️ Config'}].map(t=>(<button key={t.id} className={`tab-btn ${perfilTab===t.id?'ativo':''}`} onClick={()=>setPerfilTab(t.id)}>{t.l}</button>))}
        </div>

        {/* 🟢 TELA DAS MENSAGENS: AGORA ABRE O CHAT NO PERFIL, SEM IR PARA A PÁGINA DO PRODUTO 🟢 */}
        {perfilTab === 'chats' && (
          <div className="painel-lista">
            <h2>Minhas Conversas</h2>

            {chatAtivo?.id ? (() => {
              const outroUsuario = chatAtivo.comprador === usuario.nome ? chatAtivo.vendedor : chatAtivo.comprador;
              const produtoNome = textoSeguro(chatAtivo.produto_nome, 'Anúncio');

              return (
                <div style={{background:'#111', border:'1px solid #333', borderRadius:'16px', overflow:'hidden'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:'12px', padding:'18px 20px', background:'#161616', borderBottom:'1px solid #333', flexWrap:'wrap'}}>
                    <div>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{marginBottom:'12px'}}
                        onClick={() => { setChatAtivo(null); setMensagensChat([]); setNovaMsg(''); }}
                      >
                        ← Voltar para conversas
                      </button>
                      <h3 style={{margin:0, fontSize:'22px'}}>💬 {produtoNome}</h3>
                      <p style={{margin:'6px 0 0', color:'#888', fontSize:'13px'}}>Falando com: <span style={{color:'#fff'}}>{outroUsuario || 'Usuário'}</span></p>
                    </div>
                    <span style={{background:'rgba(255,30,30,0.12)', color:'var(--primary)', border:'1px solid var(--primary)', padding:'7px 12px', borderRadius:'999px', fontSize:'12px', fontWeight:'bold'}}>CHAT DIRETO</span>
                  </div>

                  <div style={{height:'430px', overflowY:'auto', padding:'20px', display:'flex', flexDirection:'column', gap:'14px', background:'#0a0a0a'}}>
                    {mensagensChat.length === 0 ? (
                      <div style={{margin:'auto', color:'#666', textAlign:'center', lineHeight:'1.6'}}>
                        Nenhuma mensagem ainda.<br/>Envie uma resposta para iniciar a conversa.
                      </div>
                    ) : (
                      mensagensChat.map((m, idx) => {
                        const remetente = textoSeguro(m?.remetente, 'Usuário');
                        const conteudo = textoSeguro(m?.conteudo, '');
                        const isMe = remetente === usuario.nome;

                        return (
                          <div key={m?.id || idx} style={{alignSelf:isMe?'flex-end':'flex-start', maxWidth:'78%'}}>
                            <div style={{fontSize:'11px', color:'#777', marginBottom:'4px', textAlign:isMe?'right':'left'}}>{remetente}</div>
                            <div style={{background:isMe?'var(--primary)':'#222', color:'#fff', padding:'12px 16px', borderRadius:isMe?'16px 16px 4px 16px':'16px 16px 16px 4px', lineHeight:'1.4', wordBreak:'break-word'}}>
                              {conteudo || <i style={{opacity:0.6}}>Mensagem vazia</i>}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <form onSubmit={enviarMsg} style={{display:'flex', gap:'10px', padding:'15px', background:'#1a1a1a', borderTop:'1px solid #333', alignItems:'center'}}>
                    <input
                      type="text"
                      value={novaMsg}
                      onChange={e=>setNovaMsg(e.target.value)}
                      placeholder="Digite sua resposta..."
                      style={{flex:1, padding:'12px 18px', background:'#111', border:'1px solid #444', borderRadius:'25px', outline:'none', color:'#fff', fontSize:'14px'}}
                    />
                    <button type="submit" className="btn" style={{borderRadius:'25px', padding:'12px 22px', whiteSpace:'nowrap'}} disabled={!novaMsg.trim()}>
                      ENVIAR
                    </button>
                  </form>
                </div>
              );
            })() : meusChats.length === 0 ? (
              <div className="empty-state" style={{padding:'40px 0'}}><div className="icon">💬</div><h3>Nenhum chat ativo</h3></div>
            ) : (
              meusChats.map(c => {
                const outroUsuario = c.comprador === usuario.nome ? c.vendedor : c.comprador;
                const produtoNome = textoSeguro(c.produto_nome, 'Anúncio');

                return (
                  <div
                    key={c.id}
                    className="transacao-item"
                    style={{cursor:'pointer', borderLeft:'4px solid var(--primary)'}}
                    onClick={() => { setChatAtivo(c); setNovaMsg(''); }}
                  >
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center', gap:'14px', flexWrap:'wrap'}}>
                      <div>
                        <strong style={{fontFamily:"'Rajdhani',sans-serif", fontSize:'18px'}}>{produtoNome}</strong>
                        <div style={{fontSize:'13px',color:'#888', marginTop:'4px'}}>Falando com: <span style={{color:'#fff'}}>{outroUsuario || 'Usuário'}</span></div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm"
                        style={{borderRadius:'50px', background:'transparent', border:'1px solid var(--primary)', color:'var(--primary)'}}
                        onClick={(e) => { e.stopPropagation(); setChatAtivo(c); setNovaMsg(''); }}
                      >
                        ABRIR CHAT
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {perfilTab==='anuncios'&&(
          <div className="painel-container" style={{display:'flex', gap:'30px', flexWrap:'wrap'}}>
            <div className="form-box" style={{flex:'1 1 300px'}}>
              <h2>Vender uma Peça 🚀</h2>
              <form onSubmit={publicar}>
                <input type="text" placeholder="Nome exato da peça no catálogo" value={vNome} onChange={e=>setVNome(e.target.value)} required/>
                
                <div style={{display:'flex', gap:'10px', flexDirection:'column', marginBottom:'16px'}}>
                  <label style={{fontSize:'12px', color:'#888', marginBottom:'-5px'}}>Tipo e Estado</label>
                  <div style={{display:'flex', gap:'10px'}}>
                    <select value={vTipo} onChange={ev=>setVTipo(ev.target.value)} style={{flex:1}}>
                      <option value="Combo">Combo</option>
                      <option value="Blade">Blade</option>
                      <option value="Ratchet">Ratchet</option>
                      <option value="Bit">Bit</option>
                    </select>
                    <select value={vCond} onChange={ev=>setVCond(ev.target.value)} style={{flex:2}}>
                      <option value="Novo na embalagem">📦 Novo na embalagem</option>
                      <option value="Novo">✨ Novo</option>
                      <option value="Usado">⚔️ Usado</option>
                      <option value="Muito usado">🩹 Muito usado</option>
                    </select>
                  </div>
                </div>

                {precoSugerido && (
                  <div style={{background:'rgba(16, 185, 129, 0.1)', borderLeft:'4px solid #10b981', padding:'12px', fontSize:'13px', marginBottom:'16px', borderRadius:'0 8px 8px 0'}}>
                    💡 A IA sugere <strong>R$ {precoSugerido}</strong> baseada na condição <strong>"{vCond}"</strong>.
                  </div>
                )}

                <input type="number" placeholder="Defina seu Valor (R$)" value={vPreco} onChange={e=>setVPreco(e.target.value)} required/>
                <p style={{fontSize:'12px',color:'#444',marginBottom:'6px', marginTop:'10px'}}>Foto do produto (Se vazio, usaremos a oficial)</p>
                <input type="file" accept="image/*" onChange={e=>setVFile(e.target.files[0])} style={{marginBottom:'16px'}}/>
                <textarea placeholder="Descrição detalhada do estado..." rows="3" value={vDesc} onChange={e=>setVDesc(e.target.value)}/>
                
                <button type="submit" style={{width:'100%',borderRadius:'50px'}} disabled={uploading}>
                  {uploading?'⏳ Salvando histórico e anunciando...':'PUBLICAR ANÚNCIO'}
                </button>
              </form>
            </div>
            
            <div className="painel-lista" style={{flex:'2 1 400px'}}>
              <h2>Meus Anúncios Ativos ({meusProd.length})</h2>
              {meusProd.length===0?<p style={{color:'#333'}}>Nenhuma peça à venda.</p>
                :<div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:'15px'}}>
                  {meusProd.map(p=>{
                    const cond = CONDICOES_INFO[p.condicao] || CONDICOES_INFO['Usado'];
                    return (
                    <div key={p.id} className="card" style={{padding:'14px'}}>
                      <div className="img-wrapper" style={{minHeight:'100px'}}><ProdImg nome={p.nome} tipo={p.tipo} customSrc={p.imagem} style={{height:'90px',objectFit:'contain',padding:'4px'}}/></div>
                      <h3 style={{fontSize:'13px',marginBottom:'6px', height:'32px', overflow:'hidden'}}>{p.nome}</h3>
                      <span style={{background: cond.badge, color: cond.textoCor, padding:'2px 6px', borderRadius:'4px', fontSize:'10px', display:'inline-block', marginBottom:'8px'}}>{cond.icone} {p.condicao}</span>
                      <span className="preco" style={{fontSize:'16px',margin:'0 0 12px',display:'block'}}>R$ {Number(p.preco).toFixed(2)}</span>
                      <button
                        className="btn btn-danger-sm btn-sm"
                        style={{width:'100%',borderRadius:'50px'}}
                        disabled={String(removendoAnuncioId) === String(p.id)}
                        onClick={(e)=>{ e.stopPropagation(); excluirAnuncioPerfil(p); }}
                      >
                        {String(removendoAnuncioId) === String(p.id) ? 'EXCLUINDO...' : 'EXCLUIR'}
                      </button>
                    </div>
                  )})}
                </div>
              }
            </div>
          </div>
        )}

        {perfilTab==='compras'&&(
          <div className="painel-lista">
            <h2>Histórico de Compras</h2>
            {compras.length===0?<div className="empty-state" style={{padding:'40px 0'}}><div className="icon">📦</div><h3>Nenhuma compra ainda</h3></div>
              :compras.map(c=>(
                <div key={c.id} className="transacao-item">
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'14px'}}>
                    <div style={{display:'flex',gap:'14px',alignItems:'center'}}>
                      <div className="carrinho-thumb"><ProdImg nome={c.nome_peca} tipo="Combo" customSrc={c.imagem} style={{width:'100%',height:'100%',objectFit:'contain',padding:'4px'}}/></div>
                      <div><strong style={{fontFamily:"'Rajdhani',sans-serif"}}>{c.nome_peca}</strong> <small style={{color:'#444'}}>×{c.quantidade}</small><div style={{fontSize:'12px',color:'#444'}}>Vendedor: {c.vendedor}</div></div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <span className="preco" style={{margin:0,fontSize:'18px'}}>R$ {(Number(c.preco)*c.quantidade).toFixed(2)}</span>
                      <div style={{marginTop:'6px'}}>{c.avaliado?<span style={{color:'var(--success)',fontSize:'12px'}}>✅ Avaliado</span>:<button className="btn btn-sm" style={{borderRadius:'50px',background:'transparent',border:'1px solid var(--primary)',color:'var(--primary)'}} onClick={()=>confirmarRec(c.id,c.vendedor)}>AVALIAR</button>}</div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {perfilTab==='vendas'&&(
          <div className="painel-lista">
            <h2>Minhas Vendas</h2>
            {vendas.length===0?<div className="empty-state" style={{padding:'40px 0'}}><div className="icon">💰</div><h3>Nenhuma venda ainda</h3></div>
              :vendas.map(v=>(
                <div key={v.id} className="transacao-item">
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'14px'}}>
                    <div style={{display:'flex',gap:'14px',alignItems:'center'}}>
                      <div className="carrinho-thumb"><ProdImg nome={v.nome_peca} tipo="Combo" customSrc={v.imagem} style={{width:'100%',height:'100%',objectFit:'contain',padding:'4px'}}/></div>
                      <div><strong style={{fontFamily:"'Rajdhani',sans-serif"}}>{v.nome_peca}</strong> <small style={{color:'#444'}}>×{v.quantidade}</small><div style={{fontSize:'12px',color:'#444'}}>Comprador: {v.comprador}</div></div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <span className="preco" style={{margin:0,fontSize:'18px',color:'var(--success)'}}>+ R$ {(Number(v.preco)*v.quantidade).toFixed(2)}</span>
                      <div style={{fontSize:'11px',color:'var(--success)',marginTop:'4px'}}>✅ Aprovado</div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {perfilTab==='cfg'&&(
          <div className="form-box" style={{maxWidth:'480px'}}>
            <h2>Configurações</h2>
            <p style={{fontSize:'13px',color:'#444',marginBottom:'14px'}}>Altere sua foto de perfil</p>
            <input type="file" accept="image/*" onChange={e=>setCfgFile(e.target.files[0])}/>
            <button onClick={salvarFoto} disabled={uploading} style={{marginTop:'8px',borderRadius:'50px'}}>{uploading?'⏳ Enviando...':'SALVAR FOTO'}</button>
          </div>
        )}
      </div>
    );
  };

  const renderCarrinho = () => (
    <div className="carrinho-container" style={{display:'flex', gap:'30px', flexWrap:'wrap', alignItems:'flex-start'}}>
      <div style={{flex:'2 1 400px'}}>
        <div className="section-header"><h2>🛒 Carrinho</h2></div>
        
        {carrinho.length===0 ? (
          <div className="empty-state">
            <div className="icon">🌪️</div>
            <h3 style={{color:'#333',fontSize:'28px',marginBottom:'10px'}}>Carrinho Vazio</h3>
            <p style={{color:'#333',marginBottom:'24px'}}>Explore o marketplace!</p>
            <button className="btn" onClick={()=>navegar('marketplace')}>IR PARA O MARKETPLACE</button>
          </div>
        ) : (
          <div className="form-box" style={{padding:'24px'}}>
            {carrinho.map(p=>(
              <div key={p.id} className="carrinho-item" style={{display:'flex', gap:'16px', borderBottom:'1px solid #222', paddingBottom:'16px', marginBottom:'16px'}}>
                <div className="carrinho-thumb" style={{width:'80px', height:'80px', background:'#222', borderRadius:'8px'}}><ProdImg nome={p.nome} tipo={p.tipo} customSrc={p.imagem} style={{width:'100%',height:'100%',objectFit:'contain',padding:'4px'}}/></div>
                <div style={{flex:1}}>
                  <strong style={{fontFamily:"'Rajdhani',sans-serif",fontSize:'18px'}}>{p.nome}</strong>
                  <div style={{fontSize:'12px',color:'#888',marginTop:'2px'}}>Vendedor: <span style={{color:'#fff'}}>{p.vendedor}</span></div>
                  <div style={{fontSize:'12px',color:'#888',marginTop:'2px'}}>Condição: {p.condicao || 'Usado'}</div>
                </div>
                <div style={{display:'flex',flexDirection:'column', alignItems:'flex-end', justifyContent:'space-between'}}>
                  <button className="btn btn-ghost btn-sm" style={{color:'#ef4444', padding:'0'}} onClick={()=>rmCart(p.id)}>Remover</button>
                  <div style={{textAlign:'right'}}>
                    <span style={{color:'#555',fontSize:'13px', marginRight:'8px'}}>×{p.quantidade}</span>
                    <strong className="preco" style={{margin:0,fontSize:'18px'}}>R$ {(Number(p.preco)*p.quantidade).toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {carrinho.length > 0 && (
        <div className="painel-resumo" style={{flex:'1 1 300px', background:'#111', padding:'24px', borderRadius:'16px', position:'sticky', top:'90px'}}>
          <h3 style={{marginBottom:'20px'}}>Resumo do Pedido</h3>
          
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px', color:'#aaa'}}>
            <span>Subtotal ({qtdCart} itens)</span>
            <span>R$ {carrinho.reduce((a,p) => a + Number(p.preco) * p.quantidade, 0).toFixed(2)}</span>
          </div>

          <hr style={{borderColor:'#222', margin:'20px 0'}}/>

          <div style={{marginBottom:'20px'}}>
            <h4 style={{fontSize:'14px', marginBottom:'10px'}}>🚚 Calcular Frete</h4>
            <div style={{display:'flex', gap:'8px'}}>
              <input type="text" placeholder="00000-000" value={cepDestino} onChange={e => setCepDestino(e.target.value)} maxLength="9" style={{flex:1, background:'#222', border:'none', color:'#fff', padding:'10px', borderRadius:'8px'}}/>
              <button className="btn btn-sm" style={{borderRadius:'8px'}} onClick={calcularFrete} disabled={buscandoFrete || cepDestino.length < 8}>{buscandoFrete ? '⌛' : 'CALCULAR'}</button>
            </div>

            {enderecoEntrega && (
              <div style={{fontSize:'12px', color:'#888', marginTop:'10px'}}>
                Entregar em: <strong style={{color:'#fff'}}>{enderecoEntrega.logradouro}, {enderecoEntrega.bairro} - {enderecoEntrega.localidade}/{enderecoEntrega.uf}</strong>
              </div>
            )}

            {dadosFrete && (
              <div style={{marginTop:'16px', display:'flex', flexDirection:'column', gap:'10px'}}>
                <label style={{display:'flex', justifyContent:'space-between', alignItems:'center', background: freteSel === 'pac' ? 'rgba(255,30,30,0.1)' : '#1a1a1a', border: `1px solid ${freteSel === 'pac' ? 'var(--primary)' : '#333'}`, padding:'12px', borderRadius:'8px', cursor:'pointer'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <input type="radio" name="frete" checked={freteSel === 'pac'} onChange={() => setFreteSel('pac')} />
                    <div><strong style={{display:'block'}}>Correios PAC</strong><span style={{fontSize:'11px', color:'#888'}}>Chega em {dadosFrete.pac.prazo} dias úteis</span></div>
                  </div>
                  <strong style={{color:'#fff'}}>R$ {dadosFrete.pac.valor.toFixed(2)}</strong>
                </label>
                <label style={{display:'flex', justifyContent:'space-between', alignItems:'center', background: freteSel === 'sedex' ? 'rgba(255,30,30,0.1)' : '#1a1a1a', border: `1px solid ${freteSel === 'sedex' ? 'var(--primary)' : '#333'}`, padding:'12px', borderRadius:'8px', cursor:'pointer'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <input type="radio" name="frete" checked={freteSel === 'sedex'} onChange={() => setFreteSel('sedex')} />
                    <div><strong style={{display:'block'}}>Correios SEDEX</strong><span style={{fontSize:'11px', color:'#888'}}>Chega em {dadosFrete.sedex.prazo} dias úteis</span></div>
                  </div>
                  <strong style={{color:'#fff'}}>R$ {dadosFrete.sedex.valor.toFixed(2)}</strong>
                </label>
              </div>
            )}
          </div>

          <hr style={{borderColor:'#222', margin:'20px 0'}}/>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}><span style={{fontSize:'18px'}}>Total</span><h2 style={{color:'var(--primary)', margin:0}}>R$ {totalCart().toFixed(2)}</h2></div>
          <button className="btn" style={{width:'100%', padding:'15px', borderRadius:'8px', opacity: dadosFrete ? 1 : 0.5}} onClick={checkout} disabled={!dadosFrete}>
            {dadosFrete ? 'FINALIZAR COMPRA 🔒' : 'CALCULE O FRETE PRIMEIRO'}
          </button>
          {!dadosFrete && <p style={{fontSize:'11px', color:'#ef4444', textAlign:'center', marginTop:'8px'}}>É obrigatório selecionar o envio para finalizar.</p>}
        </div>
      )}
    </div>
  );

  return(
    <div className="app-container">
      <header className="navbar">
        <div className="navbar-logo" style={{cursor: 'pointer'}} onClick={()=>navegar('home')}>LIGA <span>BEYBLADE</span></div>
        <nav>
          {[{id:'home',l:'Home'},{id:'catalogo',l:'Catálogo'},{id:'marketplace',l:'Marketplace'}].map(n=>(<button key={n.id} className={`nav-btn ${pagina===n.id?'active':''}`} onClick={()=>navegar(n.id)}>{n.l}</button>))}
          <button className={`nav-btn nav-btn-cta ${pagina==='perfil'?'active':''}`} onClick={()=>navegar('perfil')}>{usuario?`🌪️ ${usuario.nome}`:'Entrar / Vender'}</button>
          <button className={`nav-btn nav-btn-cart ${qtdCart>0?'has-items':''}`} onClick={()=>navegar('carrinho')}>🛒 {qtdCart>0?`(${qtdCart})`:''}</button>
        </nav>
      </header>

      <main>
        {loading ? (
          <div className="loading-screen"><div className="loading-spinner"/><p>Sincronizando Mercado...</p></div>
        ) : (
          <ErroBoundary key={`${pagina}-${anuncioSel?.id || pecaSel || ''}`}>
            {pagina==='home'        && renderHome()}
            {pagina==='catalogo'    && renderCatalogo()}
            {pagina==='marketplace' && renderMarketplace()}
            {pagina==='carrinho'    && renderCarrinho()}
            {pagina==='perfil'      && renderPerfil()}
            {pagina==='anuncio'     && renderAnuncio()}
          </ErroBoundary>
        )}
      </main>

      {lightbox && (
        <div className="lightbox" onClick={()=>setLightbox(null)}>
          <span className="lightbox-close">&times;</span>
          <img src={lightbox} alt="" onClick={ev=>ev.stopPropagation()}/>
        </div>
      )}

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-col"><span className="footer-logo">LIGA BEYBLADE</span><p>O ecossistema definitivo para Bladers.</p><div className="social-links"><i className="fa-brands fa-instagram" onClick={()=>alert('Abrindo Instagram...')}></i><i className="fa-brands fa-discord" onClick={()=>alert('Abrindo Discord...')}></i><i className="fa-brands fa-youtube" onClick={()=>alert('Abrindo YouTube...')}></i></div></div>
          <div className="footer-col"><h4>Navegação</h4><ul><li style={{cursor: 'pointer'}} onClick={()=>navegar('marketplace')}>Explorar Marketplace</li><li style={{cursor: 'pointer'}} onClick={()=>navegar('catalogo')}>Ver Catálogo Oficial</li><li style={{cursor: 'pointer'}} onClick={()=>navegar('perfil')}>Começar a Vender</li></ul></div>
          <div className="footer-col"><h4>Suporte</h4><ul><li style={{cursor: 'pointer'}} onClick={()=>alert('Em breve: Página explicativa de Como Funciona!')}>Como Funciona</li><li style={{cursor: 'pointer'}} onClick={()=>alert('Em breve: Detalhes sobre Taxas e Pagamentos.')}>Taxas e Pagamentos</li><li style={{cursor: 'pointer'}} onClick={()=>alert('Em breve: Informações de Segurança.')}>Segurança</li><li style={{cursor: 'pointer'}} onClick={()=>alert('Em breve: Central de Suporte.')}>Suporte</li></ul></div>
          <div className="footer-col"><h4>Legal</h4><ul><li style={{cursor: 'pointer'}} onClick={()=>alert('Em breve: Termos de Uso do site.')}>Termos de Uso</li><li style={{cursor: 'pointer'}} onClick={()=>alert('Em breve: Política de Privacidade.')}>Política de Privacidade</li><li style={{cursor: 'pointer'}} onClick={()=>alert('Em breve: Diretrizes da Comunidade.')}>Diretrizes</li></ul></div>
        </div>
        <div className="footer-bottom">&copy; 2026 Liga Beyblade Marketplace — Todos os direitos reservados.</div>
      </footer>
    </div>
  );
}