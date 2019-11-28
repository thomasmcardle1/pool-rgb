'use strict'


/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Color = use('App/Models/Color')
const ColorScheme = use('App/Models/ColorScheme')
const ModeController = use('App/Models/Mode');
const led = use('App/Controllers/LedController');
const Mode = new ModeController();
const LedController = new led(Mode);

var CURRENT_COLOR = {
    blue: 255,
    green: 255,
    id: 1,
    name: "white",
    red: 255,
    white: 255
}

Route.on('/').render('welcome')

Route.group(() => {
    Route.get('colors', async() => {
        return await Color.all()
    })
    Route.post('color', async({request, response}) => {
        const color = new Color;
        color.name  = request.input('name')
        color.red   = request.input('red')
        color.green = request.input('green')
        color.blue  = request.input('blue')
        color.white = request.input('white')
        await color.save();
        return response.ok(color)
    })
    Route.get('colorschemes', async({request, response}) => {
        const colorschemes = await ColorScheme.all();
        return response.ok(colorschemes)
    })
    Route.post('colorscheme/:id', async({request, response}) => {
        const scheme_id = parseInt(request.params.id);
        const colorscheme = await ColorScheme.find(scheme_id);
        colorscheme.name = request.input('name');
        await colorscheme.save();

        var request_colors = request.input('colors');
        var color_ids = [];
        for (var key in request_colors) {
            color_ids.push(request_colors[key].id);
        }
        await colorscheme.colors().detach();

        var counter = 0;
        await colorscheme.colors().attach(color_ids, (color_order) => {
            color_order.order = counter;
            counter++;
        });

        var color_scheme = await colorscheme.colors().fetch()
        return response.ok(color_scheme);
    });
    Route.get('colorsinscheme/:id', async({params}) => {
        var scheme = params.id;
        const colorschemes = await ColorScheme.find(scheme);
        return colorschemes.colors().fetch();
    })
    Route.get('color/:id', async ({params}) => {
        const color = await Color.find(params.id);
        return color;
    })
    Route.delete('color/:id', async ({params}) => {
        const color = await Color.find(params.id);
        if (color) {
            var schemes = await color.colorSchemes().fetch()
            if (schemes.rows.length > 0) {
                var schemes = await color.colorSchemes().detach();
                await color.delete();
                return {color, schemes}
            }
            await color.delete();
            return color;
        }
        return color;
    })
    Route.get('schemeswithcolor/:id', async ({params}) => {
        const color = await Color.find(params.id);
        var schemes = await color.colorSchemes().fetch()
        return schemes;
    })
    Route.put('color/:id', async({request, response}) => {
        const color = await Color.find(request.params.id);
        if (!request.input('colors') || !request.input('name')) {
            return response.badRequest();
        }
        const input_colors = request.input('colors');
        color.red = input_colors.red;
        color.green = input_colors.green;
        color.blue = input_colors.blue;
        color.name = request.input('name');
        await color.save();
        return response.ok(color);
    })
}).prefix('api')

Route.group(() => {
    Route.get('modes', () => {
        return Mode.getAllModes();
    })
    Route.get('mode', () => {
        console.log(`GET: MODE = ${Mode.currentMode()}`)
        return Mode.currentMode();
    })
    Route.get('color', ({request, response}) => {
        return response.ok(CURRENT_COLOR);
    });
    Route.post('color', ({request, response}) => {
        var color = {};
        color.name  = request.input('name')
        color.red   = request.input('red')
        color.green = request.input('green')
        color.blue  = request.input('blue')
        color.white = request.input('white')
        console.log(color);
        CURRENT_COLOR = color;
        return response.ok(color)
    });
    Route.post('mode/rgb', async ({request, response})=> {
        var mode = 'rgb';
        var color = request.input('color');
        color = await Color.find(color.id);
        LedController.setMode(mode, color);
        return response.ok(LedController.toString());
    })
    Route.post('mode/wheel', async ({request, response})=> {
        var mode = 'wheel';
        LedController.setMode(mode);
        return response.ok(LedController.toString());
    })
    Route.post('mode/white', async ({request, response})=> {
        var mode = 'white';
        LedController.setMode(mode);
        console.log(mode);
        return response.ok(LedController.toString());
    })

}).prefix('controller')