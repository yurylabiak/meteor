import { Meteor } from 'meteor/meteor';
import { _meteorAngular } from 'meteor/angular';
import ngFileUpload from 'ng-file-upload';
import angularElastic from 'angular-elastic';
import Buffer from 'buffer';

window.Buffer = Buffer;

angular
    .module('salephone', [
      'ionic',
      'angular-meteor',
      'pascalprecht.translate',
      ngFileUpload,
      'ngCookies',
      'ngSanitize',
      'angularMoment',
      angularElastic,
      'ngCordova'
    ]);

function onReady() {
  angular.bootstrap(document, ['salephone']);
  if(Meteor.isCordova){
    navigator.splashscreen.hide();
  }  
}

if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}
