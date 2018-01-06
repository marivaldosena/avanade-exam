import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isPasswordValid = false;
  msgErroPassword = 'Campo inválido';
  isUsernameValid = false;
  msgErroUsername = 'Campo inválido';
  isDisabled = true;

  constructor(private http: HttpClient) { }

  ngOnInit() {
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

  private checkFormStatus() {
    if (this.isPasswordValid &&
      this.isUsernameValid
    ) {
      this.isDisabled = false;
    }
  }

  onSubmit(form: NgForm){
    this.http.post('http://api.avanade.gama.academy/login', (req, res) => {
       let new_user = {
         username: form.value.username,
         password: form.value.password,
       };

       res.send(new_user);
       console.log(req);
       console.log(res);
     });
  }
}
