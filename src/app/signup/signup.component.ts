import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  states = [];
  cities = [];
  selectedCity = '';
  selectedState = '';
  isUsernameValid = false;
  msgErroUsername = 'Campo não pode ser vazio';
  isEmailValid = false;
  msgErroEmail = 'Campo não pode ser vazio';
  isPasswordValid = false;
  msgErroPassword = 'Campo inválido';
  isAddressValid = false;
  msgErroAddress = 'Estado inválido';
  isDisabled = true;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getStates();
  }

  isEmailOK(event) {
    let email = event.target.value;
    let re = '[a-z0-9][a-z0-9._%+-]*@[a-z0-9][a-z0-9.-]*\.[a-z]{2,20}';

    if (email.match(re)) {
      this.isEmailValid = true;
    } else if (email.trim().length === 0) {
      this.isEmailValid = false;
      this.msgErroEmail = 'Campo não pode ser vazio';
    } else {
      this.isEmailValid = false;
      this.msgErroEmail = 'Campo inválido';
    }

    this.checkFormStatus();
  }

  isUsernameOK(event) {
    let resultado = false;
    let username = event.target.value;
    let re = '[a-z0-9_-]*';

    if (username.match(re) && username.length >= 3 && username.length <= 16 ) {
      this.isUsernameValid = true;
    } else if (username.trim().length === 0) {
      this.isUsernameValid = false;
      this.msgErroUsername = 'Campo não pode ser vazio';
    } else {
      this.isUsernameValid = false;
      this.msgErroUsername = 'Campo inválido';
    }

    this.checkFormStatus();
  }

  isPasswordOK(event) {
    let password = event.target.value;

    if (password.trim().length > 0) {
      this.isPasswordValid = true;
    } else {
      this.isPasswordValid = false;
      this.msgErroPassword = 'Campo inválido';
    }

    this.checkFormStatus();
  }

  isAddressOK() {
    if (this.selectedState === '' ||
      this.selectedState.trim() === '---' ||
      this.selectedCity === 'Cidade' ||
      this.selectedCity.trim() === ''
    ) {
      this.isAddressValid = false;  
    } else {
      this.isAddressValid = true;
    }

    this.checkFormStatus();
  }

  onSubmit(form: NgForm){
     this.http.post('http://api.avanade.gama.academy/users', (req, res) => {
       let new_user = {
         username: form.value.username,
         email: form.value.email,
         password: form.value.password,
         state: form.value.state,
         city: form.value.city,
         accepts_newsletters: form.value.accepts_newsletters
       };

       res.send(new_user);
     });
  }

  getStates() {
    this.http.get('http://api.avanade.gama.academy/states').subscribe(data => {
      for (let item of data) {
        this.states.push({ state: item });
      }
    });
    this.checkFormStatus();
  }

  getCities(event) {
    this.cities = [];

    let state = event.target.value;
    this.http.get('http://api.avanade.gama.academy/cities/' + state).subscribe(data => {
      for (let item of data) {
        this.cities.push({ city: item });
      }
    });

    this.selectedState = state;
    this.checkFormStatus();
  }

  getCity(event) {
    let city = event.target.value;

    this.selectedCity = city;

    this.isAddressOK();

    this.checkFormStatus();
  }

  private checkFormStatus() {
    if (this.isEmailValid &&
      this.isAddressValid &&
      this.isPasswordValid &&
      this.isUsernameValid
    ) {
      this.isDisabled = false;
    }
  }
}