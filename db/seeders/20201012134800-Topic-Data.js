'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Topics", [
      {name: "Spells"},
      {name: "Potions"},
      {name: "Familiars"},
      {name: "Magical Artifacts"},
      {name: "Charms & Amulets"},
      {name: "Enchantments"},
      {name: "Broomsticks"},
      {name: "Curses"},
      {name: "Poison"},
      {name: "Runes & Sigils"},
      {name: "Tarot"},
      {name: "Ouija"},
      {name: "Tomes & Scrolls"},
      {name: "Alchemy"},
      {name: "Herbology"},
      {name: "Beastiary"}
      {name: "Astronomy"},
      {name: "Candle-making"},
      {name: "Omens"},
      {name: "Cooking"},
      {name: "History"},
      {name: "Divination"},
      {name: "Scrying"},
      {name: "Channeling"},
      {name: "Rites & Rituals"},
      {name: "Elemental Magic"},
      {name: "Magic Tricks"},
      {name: "Technomancy"},
      {name: "Blood magic"},
      {name: "Necromancy"},
      {name: "Astrology"},
      {name: "Numerology"},
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Topics", null, {})
  }
};
