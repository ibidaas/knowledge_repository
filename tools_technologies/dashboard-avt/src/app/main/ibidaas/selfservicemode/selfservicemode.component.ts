import { Component, OnInit, NgZone } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Router } from '@angular/router';
import { IbidaasService } from '../ibidaas.service';
import { locale as english } from '../../../i18n/en';
import { locale as greek } from '../../../i18n/el';
import { MatDialogConfig } from '@angular/material';
import { MatDialog } from '@angular/material';
import { DialogSelfService2Component } from './..//dialog-self-service2/dialog-self-service2.component';
import { DialogSelfService3Component } from './..//dialog-self-service3/dialog-self-service3.component';
import { DialogSelfService4Component } from './../dialog-self-service4/dialog-self-service4.component';
import { DialogSelfServiceComponent } from './../dialog-self-service/dialog-self-service.component';
import { DialogSelfService6Component } from './../dialog-self-service6/dialog-self-service6.component';

import * as Survey from 'survey-angular'

Survey.StylesManager.applyTheme('modern');
var windowload = 1;

var surveyJSON = {
  "title": "Which algorithm should you select?",
  "description": "Please answer the following questions to get a recommendation on which algorithm to use based on your data",
  "completedHtml": " <b style='font-style: italic;'>Questionnaire Completed!</b>\n <br>                         \nBased on your answers you should consider using: <b>Dislib Random Forest</b> algorithm.\n <br> <p style='font-size:0.7em; padding:0.7em;'>A random forest is a meta estimator that fits a number of decision tree classifiers on various sub-samples of the dataset. After each decision tree gives its prediction, majority voting is performed to improve the predictive accuracy and control over-fitting. The algorithm is implemented in a distributed manner, using pyCOMPSs.</p><br><button class='mybuttons sv-btn' onclick=\"my.namespace.publicFunc();\">ReRun</button> <button class='mybuttons sv-btn' onclick=\"my.namespace.publicFunc1(0);\">Random Forest</button>",
  "completedHtmlOnCondition": [
    {
      "expression": "{Q1} = \"item1\" and ({Q2} = \"item1\" or {Q2} = \"item2\")  and {Q3} = \"item1\" and ({Q4} = \"item2\" or {Q4} = \"item3\")",
      "html": "<b style='font-style: italic;'>Questionnaire Completed!</b>\n<br>                         \nBased on your answers you should consider using: <b>Dislib Random Forest</b> algorithm.\n <br> <p style='font-size:0.7em; padding:0.7em;'>A random forest is a meta estimator that fits a number of decision tree classifiers on various sub-samples of the dataset. After each decision tree gives its prediction, majority voting is performed to improve the predictive accuracy and control over-fitting. The algorithm is implemented in a distributed manner, using pyCOMPSs.</p><br><button class='mybuttons sv-btn' onclick=\"my.namespace.publicFunc();\">ReRun</button> <button class='mybuttons sv-btn' onclick=\"my.namespace.publicFunc1(0);\">Random Forest</button>"
    },
    {
      "expression": "{Q1} = \"item1\" and {Q2} = \"item3\" and {Q5} = \"item2\" and {Q6} = \"item2\"",
      "html": "<b style='font-style: italic;'>Questionnaire Completed!</b>\n<br>                         \nBased on your answers you should consider using: <b>ADMM</b> algorithm.\n <br> <p style='font-size:0.7em; padding:0.7em;'>Alternating Direction Method of Multipliers (ADMM) solver. ADMM is renowned for being well suited to the distributed settings, for its guaranteed convergence and general robustness with respect to the parameters. Additionally, the algorithm has a generic form that can be easily adapted to a wide range of machine learning problems with only minor tweaks in the code.</p><br><button class='mybuttons sv-btn' onclick=\"my.namespace.publicFunc();\">ReRun</button> <button class='mybuttons sv-btn' onclick=\"my.namespace.publicFunc1(1);\">ADMM</button>"
    },
    {
      "expression": "{Q1} = \"item2\"",
      "html": "<b style='font-style: italic;'>Questionnaire Completed!</b>\n<br>                         \nBased on your answers you should consider using: <b>K-means</b> algorithm.\n <br> <p style='font-size:0.7em; padding:0.7em;'>The objective of K-means is to group similar data points together in a user-specified number of clusters (K)</p><br><button class='mybuttons sv-btn' onclick=\"my.namespace.publicFunc();\">ReRun</button> <button class='mybuttons sv-btn' onclick=\"my.namespace.publicFunc1(2);\">K-means</button>"
    },
    {
      "expression": "{Q1} = \"item1\" and ({Q2} = \"item1\" or {Q2} = \"item2\") and {Q3} = \"item1\" and {Q4} = \"item1\"",
      "html": "<b style='font-style: italic;'>Questionnaire Completed!</b>\n<br>                         \nBased on your answers you should consider using: <b>Dislib Decision Tree</b> algorithm.\n <br> <p style='font-size:0.7em; padding:0.7em;'>Decision Trees are a non-parametric supervised learning method used for classification. The goal is to create a model that predicts the value of a target variable by learning simple decision rules inferred from the data features. Advantages include being able to handle both numerical and categorical data, being simple to understand and interpret, and requiring little data preparation, to name a few. The algorithm is implemented in a distributed manner, using pyCOMPSs.</p><br><button class='mybuttons sv-btn' onclick=\"my.namespace.publicFunc();\">ReRun</button> <button class='mybuttons sv-btn' onclick=\"my.namespace.publicFunc1(0);\">Decision Tree</button>"
    },
    {
      "expression": "{Q1} = \"item1\" and ({Q2} = \"item1\" or {Q2} = \"item2\") and {Q3} = \"item2\" and {Q6} = \"item2\"",
      "html": "<b style='font-style: italic;'>Questionnaire Completed!</b>\n<br>                         \nBased on your answers you should consider using: <b>K-means</b> algorithm.\n <br> <p style='font-size:0.7em; padding:0.7em;'>The objective of K-means is to group similar data points together in a user-specified number of clusters (K)</p><br><button class='mybuttons sv-btn' onclick=\"my.namespace.publicFunc();\">ReRun</button> <button class='mybuttons sv-btn' onclick=\"my.namespace.publicFunc1(2);\">K-means</button>"
    }
  ],
  "pages": [
    {
      "name": "page7",
      "elements": [
        {
          "type": "expression",
          "name": "question3",
          "title": "Please answer the following questions to get a recommendation on which algorithm to use based on your data",
        }
      ]
    },
    {
      "name": "page1",
      "elements": [
        {
          "type": "radiogroup",
          "name": "Q1",
          "title": "Does your data have label values (desired output values)?",
          "isRequired": true,
          "choices": [
            {
              "value": "item1",
              "text": "Yes"
            },
            {
              "value": "item2",
              "text": "No"
            }
          ]
        }
      ]
    },
    {
      "name": "page2",
      "elements": [
        {
          "type": "radiogroup",
          "name": "Q2",
          "title": "If your data is labeled, what is the label type?",
          "isRequired": true,
          "choices": [
            {
              "value": "item1",
              "text": "Binary (Yes/No, True/False)"
            },
            {
              "value": "item2",
              "text": "M-ary (multiple output classes)"
            },
            {
              "value": "item3",
              "text": "Real numerical values"
            }
          ]
        }
      ],
      "visibleIf": "{Q1} = \"item1\""
    },
    {
      "name": "page3",
      "elements": [
        {
          "type": "radiogroup",
          "name": "Q3",
          "title": "If case of binary or M-ary labels, what is the data type?",
          "isRequired": true,
          "choices": [
            {
              "value": "item1",
              "text": "A categorical value (e.g. cat)"
            },
            {
              "value": "item2",
              "text": "A numerical value (e.g. 6)"
            }
          ]
        }
      ],
      "visibleIf": "{Q2} = \"item1\" or {Q2} = \"item2\""
    },
    {
      "name": "page4",
      "elements": [
        {
          "type": "radiogroup",
          "name": "Q4",
          "title": "How many observations does your dataset have?",
          "isRequired": true,
          "choices": [
            {
              "value": "item1",
              "text": "Less than 1000"
            },
            {
              "value": "item2",
              "text": "1000-10000"
            },
            {
              "value": "item3",
              "text": "More than 10000"
            }
          ]
        }
      ]
    },
    {
      "name": "page5",
      "elements": [
        {
          "type": "radiogroup",
          "name": "Q5",
          "title": "What category does your data fall into best?",
          "isRequired": true,
          "choices": [
            {
              "value": "item1",
              "text": "Tabular data"
            },
            {
              "value": "item2",
              "text": "Sensor data (Temporal)"
            }
          ]
        }
      ]
    },
    {
      "name": "page6",
      "elements": [
        {
          "type": "radiogroup",
          "name": "Q6",
          "title": "Do you need special insights into your trained model? (e.g., feature importance)",
          "isRequired": true,
          "choices": [
            {
              "value": "item1",
              "text": "Yes"
            },
            {
              "value": "item2",
              "text": "No"
            }
          ]
        }
      ]
    }
  ],
  "showPageTitles": false,
  "showProgressBar": "bottom",
  "goNextPageAutomatic": true,
  "firstPageIsStarted": true
}
var survey = new Survey.Model(surveyJSON);

declare global {
  interface Window { my: any; }
}

@Component({
  selector: 'app-selfservicemode',
  templateUrl: './selfservicemode.component.html',
  styleUrls: ['./selfservicemode.component.scss']
})
export class SelfservicemodeComponent implements OnInit {


  preconfiguredProjects: any[];
  selfServiceProjects: any[];
  disproject: any[];



  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _router: Router,
    private _IbidaasService: IbidaasService,
    public dialog: MatDialog,
    private ngZone: NgZone
  ) {
    // if (!sessionStorage.getItem('user')) {
    //     this._router.navigateByUrl('/auth');
    // }
    this._fuseTranslationLoaderService.loadTranslations(english, greek);
  }

  ngOnInit(): void {

    window.my = window.my || {};
    window.my.namespace = window.my.namespace || {};
    window.my.namespace.publicFunc = this.publicFunc.bind(this);
    window.my.namespace.publicFunc1 = this.publicFunc1.bind(this);

    if (windowload == 1) {
      //var survey = new Survey.Model(surveyJSON);
      survey
        .onComplete
        .add(function (result) {
          document
            .querySelector('#i')
            .textContent = '';
        });
      Survey.SurveyWindowNG.render("quest", { model: survey, isExpanded: true });
      windowload = 0;
    }
    var myobj = document.getElementById("quest");
    myobj.style.visibility = 'visible';

    this._IbidaasService.getPreconfiguredProjects().then(res => {
      console.log(res);
      this.selfServiceProjects = res.filter(c => c.id > 9);

    })
  }
  publicFunc1(a) {
    this.ngZone.run(() => this.privateFunc1(a));
  }

  publicFunc() {
    this.ngZone.run(() => this.privateFunc());
  }

  privateFunc() {
    survey.currentPageNo = 0;
    survey.clear();

  }

  privateFunc1(a) {
    if (a == 0) {
      this._router.navigate(['/selfservicemode'])
    }
    else if (a == 1) {
      this._router.navigate(['/projectnew/2/10'])
    }
    else if (a == 2) {
      this._router.navigate(['/projectnew/2/13'])
    }

  }

  ngOnDestroy() {

    //Survey.SurveyWindowNG.render("surveyElement", { model: survey, isExpanded: true })
    var myobj = document.getElementById("quest");
    myobj.style.visibility = 'hidden';

  }

  ChooseDial(x: any) {
    if (x == 10) {
      this.openDialog();
    }
    if (x == 12) {
      this.openDialog2();
    }
    if (x == 13) {
      this.openDialog3();
    }


    if (x == 14) {
      this.openDialog4();
    }


    if (x == 16) {
      this.openDialog6();
    }

  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    //dialogConfig.disableClose=true;
    dialogConfig.height = '490px';
    dialogConfig.width = '430px';
    this.dialog.open(DialogSelfServiceComponent, dialogConfig);
  }

  openDialog2() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.height = '490px';
    dialogConfig.width = '430px';
    this.dialog.open(DialogSelfService2Component, dialogConfig);
  }

  openDialog3() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.height = '490px';
    dialogConfig.width = '430px';
    this.dialog.open(DialogSelfService3Component, dialogConfig);

  }

  openDialog4() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.height = '600px';
    dialogConfig.width = '440px';
    this.dialog.open(DialogSelfService4Component, dialogConfig);

  }

  openDialog6() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.height = '470px';
    dialogConfig.width = '430px';
    this.dialog.open(DialogSelfService6Component, dialogConfig);

  }




}
