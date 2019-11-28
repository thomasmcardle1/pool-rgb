'use strict'

const Model = use('Model')

class Color extends Model {
    static get createdAtColumn () {
        return null;
    }
    static get updatedAtColumn() {
        return null;
    }
    colorSchemes () {
        return this
            .belongsToMany('App/Models/ColorScheme')
            .pivotModel('App/Models/ColorColorScheme')
            .withPivot(['order'])
    }
}

module.exports = Color
