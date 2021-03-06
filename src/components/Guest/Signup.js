import api from "../utils/api";
import { Component } from "../utils/App";
import { redirect } from "../utils/routes";
import { signupNodes } from "../utils/nodes";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      errors: {},
      success: null,
      isFetching: false
    };
    this.elements = signupNodes();
    this.submit = document.forms.signup.elements.submit;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange();
    this.handleSubmit();
    this.showLoaders();
  }

  showLoaders() {
    setInterval(() => {
      if (this.state.isFetching) {
        this.submit.innerHTML = "Signing up...";
        this.submit.setAttribute("disabled", "disabled");
      } else {
        this.submit.innerHTML = "Sign up";
        this.submit.removeAttribute("disabled");
      }
    }, 0);
  }

  handleChange() {
    const data = { ...this.state.data };
    Object.values(this.elements).map(el => {
      el.addEventListener("change", e => {
        data[e.target.name] = e.target.value;
        this.setState({ data });
        console.log(this.state.data);
      });
    });
  }

  handleSubmit(e) {
    const errors = { ...this.state.errors };
    this.submit.addEventListener("click", e => {
      e.preventDefault();
      this.setState({ isFetching: true });
      console.log(this.state);
      api
        .post("/users/auth/signup/", this.state.data)
        .then(res => {
          this.setState({ success: res.ok });
          return res.json();
        })
        .then(data => {
          this.setState({ isFetching: false });
          if (this.state.success) {
            localStorage.setItem("success", data.message);
            redirect("/auth/signin/");
          } else {
            Object.values(data).map(value => {
              Object.entries(value).map(val => {
                errors[val[0]] = val[1];
                this.setState({ errors });
              });
            });
          }
        })
        .catch(err => {
          this.setState({ isFetching: false });
          console.log(err.message);
        });
    });
  }
}

const signup = new Signup();
