import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {

  constructor(public sanitizer: DomSanitizer, private route: ActivatedRoute, private db: AngularFirestore, private auth: AuthService) { }

  url: any;
  farm: any;
  id: any;
  field: any;
  healthrecid: any;
  hcid: any;

  mode: any;

  userID: any;

  ngOnInit(): void {
    this.auth.getUserState()
      .subscribe(user => {
        this.userID = user.uid;
        this.mode = this.route.snapshot.queryParams['mode'];
        this.farm = this.route.snapshot.queryParams['farm'];
        if (this.mode == "cleanliness") {
          this.getcleanlinessurl();
        }
        else {
          this.id = this.route.snapshot.queryParams['id'];
          if (this.mode == "health") {
            this.field = this.route.snapshot.queryParams['field'];
            this.healthrecid = this.route.snapshot.queryParams['healthrecid'];
            console.log(this.farm, this.id, this.field, this.healthrecid);
            this.hcid = this.healthrecid.slice(0, this.healthrecid.length - 27) + '+' + this.healthrecid.slice(this.healthrecid.length - 26, this.healthrecid.length);
            this.geturl();
          }
          else {
            this.getfeedurl();
          }
        }
      })


  }

  geturl() {

    this.db.collection('Users').doc(this.userID).collection('Farms').doc(this.farm).collection('Livestock').doc(this.id).collection('HealthRecords').doc(this.hcid).snapshotChanges().subscribe(res => {
      var temp;
      temp = res;
      if (this.field == "CheckUpSchedule") this.url = temp.payload.data().CheckUpSchedule;
      if (this.field == "MedicalReport") this.url = temp.payload.data().MedicalReport;
      if (this.field == "VaccinationSchedule") this.url = temp.payload.data().VaccinationSchedule;
      if (this.field == "PregnancyCheckUpchedule") this.url = temp.payload.data().PregnancyCheckUpchedule;

      console.log(this.url);
    })
  }

  getfeedurl() {
    this.db.collection('Users').doc(this.userID).collection('Farms').doc(this.farm).collection('Livestock').doc(this.id).snapshotChanges().subscribe(res => {
      var temp;
      temp = res;
      this.url = temp.payload.data().FeedSchedule;
    })

  }

  getcleanlinessurl(){
    this.db.collection('Users').doc(this.userID).collection('Farms').doc(this.farm).snapshotChanges().subscribe(res => {
      var temp;
      temp = res;
      this.url = temp.payload.data().CleanlinessSchedule;
    })
  }

}
