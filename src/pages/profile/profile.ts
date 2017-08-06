import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Profile } from '../../models/chatmodels';
import { UUID } from 'angular2-uuid';

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  picture: string;
  profile: Profile;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.profile = {
      name:'test'
    };
    let uuid = UUID.UUID();
    alert(uuid);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
