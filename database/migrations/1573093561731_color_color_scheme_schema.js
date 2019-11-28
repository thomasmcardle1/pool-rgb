'use strict'

const Schema = use('Schema')

class ColorColorSchemeSchema extends Schema {
  up () {
    this.create('color_color_schemes', (table) => {
      table.integer('color_id').notNullable().unsigned().references('id').inTable('colors')
      table.integer('color_scheme_id').notNullable().unsigned().references('id').inTable('color_schemes')
      table.integer('order').notNullable()
      table.unique(['color_id', 'color_scheme_id'])
    })
  }

  down () {
    this.drop('color_color_schemes')
  }
}

module.exports = ColorColorSchemeSchema
