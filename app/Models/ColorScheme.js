'use strict'

const Model = use('Model')

class ColorScheme extends Model {
    static get createdAtColumn () {
        return null;
    }
    static get updatedAtColumn() {
        return null;
    }
    colors () {
        return this
            .belongsToMany('App/Models/Color')
            .pivotModel('App/Models/ColorColorScheme')
            .withPivot(['order'])
    }
}

module.exports = ColorScheme
