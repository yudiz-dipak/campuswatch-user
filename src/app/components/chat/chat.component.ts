import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit {

  processing: boolean = false
  allAlertData: any = []
  selectedAlert: any = []
  step: number = 1
  latLongArray = [
    { lat: 20.08, long: 72.50 },
    { lat: 21.08, long: 72.50 },
    { lat: 22.08, long: 72.50 },
    { lat: 23.08, long: 72.50 },
    { lat: 23.07, long: 72.48 },
    { lat: 23.09, long: 72.51 },
    { lat: 23.10, long: 72.512 },
    { lat: 23.11, long: 72.52 }
  ]

  allAlertCategories: any = [];

  // 
  newMessage: string = ''
  newFiles: File[] = []

  // 
  @ViewChild('newMessageDom') newMessageDom;
  @ViewChild('chatSection') chatSection: ElementRef
  @ViewChild('chatImageInput') chatImageInput: ElementRef

  // 
  constructor(public _http: HttpService) { }

  // 
  ngOnInit(): void {
    if (!this._http.auth.isLoggedIn()) {
      this._http.navigate('/')
    }
    this.init()
  }

  // 
  init() {
    this.processing = true
    const userId = this._http.auth.userId
    this._http.get(`alerts/user/list/${userId}`).subscribe((response: any) => {
      this.allAlertData = [].concat(response.data)
      this.processing = false
    }, (error) => {
      console.log("Error in fetching alerts data: ", error)
      this.processing = false
    })

    this.bindEvents();
  }

  // 
  updateLatLong(index) {
    let payload = {
      _id: this.selectedAlert.infoData._id,
      body: {
        position: this.latLongArray[index]
      }
    }
    this._http.auth._socket.socket.emit('updateAlertData', payload)

  }

  // 
  onFileSelected(files) {
    if (files && files.length) {
      this.newFiles = files
    }
  }

  // 
  bindEvents() {
    this._http.auth._socket.eventService.subscribe('onreply', (data) => {
      let index = this.allAlertData.findIndex(item => item.infoData._id == data.alertId)
      if (index >= 0) {
        this.allAlertData[index].chatData.push(data.chatData)
        if (this.allAlertData.indexOf(this.selectedAlert) == index) {
          this.selectedAlert = this.allAlertData[index]
          setTimeout(() => {
            this.chatSection.nativeElement.scrollTop = this.chatSection.nativeElement.scrollHeight
          }, 50)
        }
      }
    })

    this._http.auth._socket.eventService.subscribe('alert-resolved', (alertId) => {
      if (this.selectedAlert && this.selectedAlert.infoData && this.selectedAlert.infoData._id == alertId) {
        document.getElementById('modalBtn').click()
      }
      else {
        let index = this.allAlertData.findIndex(item => item.infoData._id == alertId)
        if (index >= 0) {
          this.allAlertData.splice(index, 1)
        }
      }
    })
  }

  // 
  resolveAlert() {
    let index = this.allAlertData.indexOf(this.selectedAlert)
    if (index >= 0) {
      this.allAlertData.splice(index, 1)
    }
    this.selectedAlert = null
    document.getElementById('modalBtn').click()
  }

  // 
  unresolveAlert() {
    this._http.auth._socket.socket.emit('unresolve-alert', this.selectedAlert.infoData._id)
    document.getElementById('modalBtn').click()
  }

  // 
  async selectAlert(alertItem) {
    this.selectedAlert = alertItem
    this.step = 2
    if (!this.allAlertCategories || !this.allAlertCategories.length) {
      await this.getAlertCategories()
    }
    setTimeout(() => {
      if (this.newMessageDom) {
        this.newMessageDom.nativeElement.addEventListener('keyup', (ev: KeyboardEvent) => {
          if (ev.keyCode == 13) {
            ev.preventDefault()
            this.sendMessage()
          }
        })
      }
      this.chatSection.nativeElement.scrollTop = this.chatSection.nativeElement.scrollHeight
    }, 100)
  }

  // 
  updateAlertType(categoryType) {
    let payload = {
      _id: this.selectedAlert.infoData._id,
      body: {
        alertCategoryId: categoryType
      }
    }
    this._http.auth._socket.socket.emit('updateAlertData', payload)

    // 
    let alertCategoryIndex = this.allAlertCategories.findIndex(item => item._id == categoryType)
    let newCategory = this.allAlertCategories[alertCategoryIndex]
    let currentIndex = this.allAlertData.indexOf(this.selectedAlert)
    this.allAlertData[currentIndex].infoData.alertType = newCategory.sTitle
    this.selectedAlert = this.allAlertData[currentIndex]
  }

  // 
  getAlertCategories(): Promise<any> {
    return new Promise(resolve => {
      this._http.get('alert-category/list-enabled').subscribe((response: any) => {
        this.allAlertCategories = [].concat(response.data)
        resolve(true)
      }, (err) => {
        resolve(false)
      })
    })
  }

  // 
  sendMessage() {
    if (this.newMessage.trim()) {
      this.sendTextMessage()
    }
    else if (this.newFiles.length) {
      let allFiles = this.newFiles
      for (let file of allFiles) {
        this._http.auth._socket.socket.emit("sendmessage", {
          alertId: this.selectedAlert.infoData._id,
          userId: this._http.auth.userId,
          type: 'image',
          sContentType: file.type,
          fileObj: file
        })
      }
      this.newFiles = []
      this.chatImageInput.nativeElement.value = null
    }

  }

  // 
  sendTextMessage() {
    const payload = {
      alertId: this.selectedAlert.infoData._id,
      from: this._http.auth.userId,
      message: this.newMessage,
      type: 'text',
      userId: this._http.auth.userId
    }
    this._http.auth._socket.socket.emit('sendmessage', payload)
    this.newMessage = '';
  }
}
