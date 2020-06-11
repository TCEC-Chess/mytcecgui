// engine.test.js
// @author octopoulo <polluxyz@gmail.com>
// @version 2020-06-10
//
/*
globals
__dirname, expect, require, test
*/
'use strict';

let {create_module} = require('./create-module');

let IMPORT_PATH = __dirname.replace(/\\/g, '/'),
    OUTPUT_MODULE = `${IMPORT_PATH}/test/engine+`;

create_module(IMPORT_PATH, [
    'common',
    //
    'engine',
], OUTPUT_MODULE, 'DEFAULTS Keys TYPES X_SETTINGS');

let {create_page_array, DEFAULTS, guess_types, Keys, merge_settings, TYPES, X_SETTINGS} = require(OUTPUT_MODULE);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// create_page_array
[
    [1, 0, 0, [2]],
    [2, 0, 0, [2, 2]],
    [3, 0, 0, [2, 2, 2]],
    [4, 0, 0, [2, 2, 2, 2]],
    [5, 0, 0, [2, 2, 2, 2, 2]],
    [6, 0, 0, [2, 2, 2, 0, 1, 2]],
    [7, 0, 0, [2, 2, 2, 0, 0, 1, 2]],
    [8, 0, 0, [2, 2, 2, 0, 0, 0, 1, 2]],
    [9, 0, 0, [2, 2, 2, 0, 0, 0, 0, 1, 2]],
    [9, 1, 0, [2, 2, 2, 0, 0, 0, 0, 1, 2]],
    [9, 2, 0, [2, 2, 2, 0, 0, 0, 0, 1, 2]],
    [9, 3, 0, [2, 1, 0, 2, 0, 0, 0, 1, 2]],
    [9, 4, 0, [2, 1, 0, 0, 2, 0, 0, 1, 2]],
    [9, 4, 1, [2, 1, 0, 0, 2, 2, 0, 1, 2]],
    [9, 4, 2, [2, 1, 0, 2, 2, 2, 0, 1, 2]],
    [9, 5, 2, [2, 1, 0, 0, 2, 2, 2, 2, 2]],
    [9, 6, 2, [2, 1, 0, 0, 2, 2, 2, 2, 2]],
    [9, 5, 4, [2, 2, 2, 2, 2, 2, 2, 2, 2]],
].forEach(([num_page, page, extra, answer], id) => {
    test(`create_page_array:${id}`, () => {
        expect(create_page_array(num_page, page, extra)).toEqual(answer);
    });
});

// guess_types
[
    [
        {
            div: '',
            game: 0,
            order: 'left|center|right',
            table_tab: {
                archive: 'season',
                live: 'stand',
            },
            timeout: 0.1,
            useful: true,
        },
        {
            div: 's',
            game: 'i',
            order: 's',
            table_tab: 'o',
            timeout: 'f',
            useful: 'b',
        },
    ],
].forEach(([settings, answer], id) => {
    test(`guess_types:${id}`, () => {
        guess_types(settings);
        Keys(answer).forEach(key => {
            expect(TYPES).toHaveProperty(key, answer[key]);
        });
    });
});

// merge_settings
[
    [{}, {}, {}, {}],
    [{advanced: {debug: ''}}, {advanced: {debug: ''}}, {debug: undefined}, {debug: undefined}],
    [
        {audio: {volume: [{min: 0, max: 10, type: 'number'}, 5]}},
        {
            advanced: {debug: ''},
            audio: {volume: [{min: 0, max: 10, type: 'number'}, 5]},
        },
        {debug: undefined, volume: 5},
        {debug: undefined, volume: 'i'}
    ],
    [
        {
            advanced: {key_time: [{min: 0, max: 1000, type: 'number'}, 0]},
            audio: {music: [['on', 'off'], 0]},
        },
        {
            advanced: {
                debug: '',
                key_time: [{min: 0, max: 1000, type: 'number'}, 0],
            },
            audio: {
                music: [['on', 'off'], 0],
                volume: [{min: 0, max: 10, type: 'number'}, 5],
            },
        },
        {debug: undefined, key_time: 0, music: 0, volume: 5},
        {debug: undefined, key_time: 'i', music: 'i', volume: 'i'},
    ],
].forEach(([x_settings, answer, answer_def, answer_type], id) => {
    test(`merge_settings:${id}`, () => {
        merge_settings(x_settings);
        expect(X_SETTINGS).toEqual(answer);
        Keys(answer_def).forEach(key => {
            expect(DEFAULTS).toHaveProperty(key, answer_def[key]);
        });
        Keys(answer_type).forEach(key => {
            expect(TYPES).toHaveProperty(key, answer_type[key]);
        });
    });
});
