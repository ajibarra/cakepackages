#!/bin/bash
################################################################################
#
# Bake is a shell script for running CakePHP bake script
# PHP versions 4 and 5
#
# CakePHP(tm) :  Rapid Development Framework (http://cakephp.org)
# Copyright 2005-2010, Cake Software Foundation, Inc.
#
# Licensed under The MIT License
# Redistributions of files must retain the above copyright notice.
#
# @copyright		Copyright 2005-2010, Cake Software Foundation, Inc.
# @link				http://cakephp.org CakePHP(tm) Project
# @package			cake
# @subpackage		cake.cake.console
# @since				CakePHP(tm) v 1.2.0.5012
# @license			MIT License (http://www.opensource.org/licenses/mit-license.php)
#
################################################################################
LIB=${0/%cake/}
APP=`pwd`

exec php -q ../cake/console/${LIB}cake.php -working "${APP}" "$@"

exit;