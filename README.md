# Gulp Boilerplate

## About
This project helps you to start a generic theme with  css, js, fonts and images

## License
UnderStrap WordPress Theme, Copyright 2013-2018 Holger Koenemann
UnderStrap is distributed under the terms of the GNU GPL version 2

http://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html

## Changelog

## Basic Features

- Comes with Bootstrap (v4) Sass source files and additional .scss files. Nicely sorted and ready to add your own variables and customize the Bootstrap variables.
- Uses a single minified CSS file for all the basic stuff.
- [Font Awesome](http://fortawesome.github.io/Font-Awesome/) integration (v4.7.0)

### File structure

```
root
├── config
│   └── routes.js
├── src
│   ├── img (your custom images)
│   ├── js
│   |  ├── vendors (all js dependencies)
│   |  └── custom-javascript.js
│   └── sass
│       ├── theme.scss
│       ├── theme
│       │   ├── partials
│       │   │   ├── _blocks.scss
│       │   │   ├── _buttons.scss
│       │   │   ├── _footer.scss
│       │   │   ├── _forms.scss
│       │   │   ├── _header.scss
│       │   │   ├── _layouts.scss
│       │   │   └── _nav.scss
│       │   ├── theme.scss
│       │   └── variables.scss
│       └── vendors (all .scss dependencies)
├── gulpconfig.json
├── gulpfile.js
└── package.json
```


## Developing With npm, Gulp and SASS and Browser Sync

### Installing Dependencies
- Make sure you have installed Node.js and Browser-Sync (optional) on your computer globally
- Then open your terminal and browse to the location of your copy
- Run: `$ npm install`


### Running
To work with and compile your Sass files on the fly start:

- `$ gulp watch`

Licenses & Credits
=
- Font Awesome: http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)
- Bootstrap: http://getbootstrap.com | https://github.com/twbs/bootstrap/blob/master/LICENSE (Code licensed under MIT documentation under CC BY 3.0.)
and of course
- jQuery: https://jquery.org | (Code licensed under MIT)