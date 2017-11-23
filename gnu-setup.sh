#!/bin/bash

npm install && bower install --allow-root

sed -i'' 's/\"px/\"..\/px/g' ./static/bower_components/px-buttons-design/_objects.buttons.scss

sed -i'' "s/\'px/\'..\/px/g" ./static/bower_components/px-defaults-design/_settings.defaults.scss

sed -i'' "s/\'inuit/\'..\/inuit/g" ./static/bower_components/px-functions-design/_tools.functions.scss

sed -i'' 's/\"px/\"..\/px/g' ./static/bower_components/px-forms-design/_base.forms.scss

echo Setup Finished
