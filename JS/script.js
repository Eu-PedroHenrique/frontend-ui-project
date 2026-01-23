"use strict";
// DOCUMENTOS
const erroEmail = document.querySelector(".email-error");
const erroSenha = document.querySelector(".senha-error");

const erroEmailSpan = document.querySelector(".email-error");
const erroSenhaSpan = document.querySelector(".senha-error");
const inputEmail = document.querySelector("#email_login");
const inputSenha = document.querySelector("#senha_login");

// TELA DE LOGIN
const verificacaoUsuario = localStorage.getItem("usuarioLogado");

if (verificacaoUsuario) {
  const usuarioLogado = JSON.parse(verificacaoUsuario);

  // Preenche os campos de login
  const inputEmail = document.querySelector("#email_login");
  const inputSenha = document.querySelector("#senha_login");
  const checkbox = document.querySelector(".manter-login");

  if (inputEmail && inputSenha) {
    inputEmail.value = usuarioLogado.email;
    inputSenha.value = usuarioLogado.password;
  }

  if (checkbox) {
    checkbox.checked = true;
  }

  // Garante que a tela de login esteja visível
  document.querySelector(".autenticacao").style.display = "flex";
  document.querySelector(".cadastro").style.display = "none";
}

// REDIRECIONAMENTO DE PÁGINAS
const loginParaCadastro = document
  .querySelector(".registrar-link")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.querySelector(".autenticacao").style.display = "none";
    document.querySelector(".cadastro").style.display = "flex";
  });

const loginParaSenha = document
  .querySelector(".esqueci-senha")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.querySelector(".autenticacao").style.display = "none";
    document.querySelector(".recuperacao-senha").style.display = "flex";
  });

const btnsVoltarLogin = document.querySelectorAll(".voltar-login");

btnsVoltarLogin.forEach((botao) => {
  botao.addEventListener("click", function (event) {
    event.preventDefault();
    document.querySelector(".autenticacao").style.display = "flex";
    document.querySelector(".recuperacao-senha").style.display = "none";
    document.querySelector(".cadastro").style.display = "none";
  });
});

// COMPARAÇÃO DE INFORMAÇÕES DE USUÁRIO
const login = document
  .querySelector(".btn-login")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const emailDigitado = document.querySelector("#email_login").value;
    const senhaDigitada = document.querySelector("#senha_login").value;
    let usuarioCadastrado = localStorage.getItem("usuario");
    const checkboxAtiva = document.querySelector(".manter-login");

    erroEmailSpan.style.display = "none";
    erroSenhaSpan.style.display = "none";
    erroEmailSpan.textContent = "";
    erroSenhaSpan.textContent = "";
    inputEmail.style.border = "1px solid rgb(168, 166, 166)";
    inputSenha.style.border = "1px solid rgb(168, 166, 166)";

    if (usuarioCadastrado === null) {
      erroEmailSpan.textContent = "Esse e-mail não corresponde a nenhuma conta";
      erroEmailSpan.style.display = "block";
      inputEmail.style.border = "2px solid red";
      return;
    }
    let objetoTransformado = JSON.parse(usuarioCadastrado);

    if (emailDigitado !== objetoTransformado.email) {
      erroEmailSpan.textContent = "Esse e-mail não corresponde a nenhuma conta";
      erroEmailSpan.style.display = "block";
      inputEmail.style.border = "2px solid red";
      return;
    }

    if (senhaDigitada !== objetoTransformado.password) {
      erroSenhaSpan.textContent = "Senha incorreta";
      erroSenhaSpan.style.display = "block";
      inputSenha.style.border = "2px solid red";
      return;
    }

    if (checkboxAtiva.checked) {
      localStorage.setItem("usuarioLogado", JSON.stringify(objetoTransformado));
    } else {
      localStorage.removeItem("usuarioLogado");
    }

    if (
      emailDigitado === objetoTransformado.email &&
      senhaDigitada === objetoTransformado.password
    ) {
      alert("Login realizado com Sucesso!");
      return;
    }
  });
// TELA DE CADASTRO
const formCadastro = document.querySelector("#form");

if (formCadastro) {
  formCadastro.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.querySelector("#name");
    const lastName = document.querySelector("#last_name");
    const birthdate = document.querySelector("#birthdate");
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");
    const confirmPassword = document.querySelector("#confirm_password");

    clearField(name);
    clearField(lastName);
    clearField(birthdate);
    clearField(email);
    clearField(password);
    clearField(confirmPassword);

    let ok = true;

    ok = validateRequired(name, "Digite seu primeiro nome.") && ok;
    ok = validateRequired(lastName, "Digite seu sobrenome.") && ok;

    ok = validateBirthdate(birthdate) && ok;

    ok = validateEmail(email) && ok;

    ok = validatePassword(password) && ok;
    ok = validateConfirmPassword(password, confirmPassword) && ok;

    ok = validateGender() && ok;

    if (!ok) return;

    const user = {
      name: name.value.trim(),
      lastName: lastName.value.trim(),
      birthdate: birthdate.value,
      email: email.value.trim(),
      password: password.value,
      gender: getSelectedGenderValue(),
    };

    localStorage.setItem("usuario", JSON.stringify(user));

    alert("Cadastro realizado com sucesso!");
    document.querySelector(".cadastro").style.display = "none";
    document.querySelector(".autenticacao").style.display = "flex";

    formCadastro.reset();

    clearField(name);
    clearField(lastName);
    clearField(birthdate);
    clearField(email);
    clearField(password);
    clearField(confirmPassword);
    clearGenderError();
  });
}

function validateRequired(input, message) {
  const value = input.value.trim();
  if (value === "") {
    setError(input, message);
    return false;
  }
  setSuccess(input);
  return true;
}

function validateBirthdate(input) {
  const value = input.value;
  if (value === "") {
    setError(input, "Informe sua data de nascimento.");
    return false;
  }

  const year = new Date(value).getFullYear();
  const currentYear = new Date().getFullYear();

  if (year < 1920 || year > currentYear) {
    setError(input, "Data de nascimento inválida.");
    return false;
  }

  setSuccess(input);
  return true;
}

function validateEmail(input) {
  const value = input.value.trim();
  if (value === "") {
    setError(input, "Informe seu e-mail.");
    return false;
  }

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(value)) {
    setError(input, "Digite um e-mail válido (ex: exemplo@gmail.com).");
    return false;
  }

  setSuccess(input);
  return true;
}

function validatePassword(input) {
  const value = input.value;

  if (value === "") {
    setError(input, "Crie uma senha.");
    return false;
  }

  if (value.length < 6) {
    setError(input, "Sua senha precisa ter pelo menos 6 caracteres.");
    return false;
  }

  setSuccess(input);
  return true;
}

function validateConfirmPassword(passwordInput, confirmInput) {
  const pass = passwordInput.value;
  const confirm = confirmInput.value;

  if (confirm === "") {
    setError(confirmInput, "Confirme sua senha.");
    return false;
  }

  if (pass !== confirm) {
    setError(confirmInput, "As senhas não coincidem.");
    return false;
  }

  setSuccess(confirmInput);
  return true;
}

function validateGender() {
  const genders = document.getElementsByName("gender");
  const selected = [...genders].some((g) => g.checked);

  if (!selected) {
    setGenderError("Selecione um gênero.");
    return false;
  }

  clearGenderError();
  return true;
}

function getSelectedGenderValue() {
  const genders = document.getElementsByName("gender");
  const selected = [...genders].find((g) => g.checked);
  return selected ? selected.value : null;
}

function setError(input, message) {
  const inputBox = input.closest(".input-box");
  const inputField = input.closest(".input-field");

  if (inputField) {
    inputField.style.border = "2px solid red";
  }

  const errorSpan = getOrCreateErrorSpan(inputBox);
  errorSpan.innerHTML = message;
  errorSpan.style.display = "block";
}

function setSuccess(input) {
  const inputBox = input.closest(".input-box");
  const inputField = input.closest(".input-field");

  if (inputField) {
    inputField.style.border = "2px solid green";
  }

  const errorSpan = inputBox ? inputBox.querySelector(".error") : null;
  if (errorSpan) {
    errorSpan.innerHTML = "";
    errorSpan.style.display = "none";
  }
}

function clearField(input) {
  const inputBox = input.closest(".input-box");
  const inputField = input.closest(".input-field");

  if (inputField) {
    inputField.style.border = "none";
  }

  const errorSpan = inputBox ? inputBox.querySelector(".error") : null;
  if (errorSpan) {
    errorSpan.innerHTML = "";
    errorSpan.style.display = "none";
  }
}

function getOrCreateErrorSpan(inputBox) {
  if (!inputBox) return null;

  let errorSpan = inputBox.querySelector(".error");
  if (!errorSpan) {
    errorSpan = document.createElement("span");
    errorSpan.classList.add("error");
    errorSpan.style.color = "red";
    errorSpan.style.fontSize = "12px";
    errorSpan.style.marginTop = "4px";
    errorSpan.style.display = "none";
    inputBox.appendChild(errorSpan);
  }
  return errorSpan;
}

function setGenderError(message) {
  const radioContainer = document.querySelector(".radio-container");
  if (!radioContainer) return;

  let span = radioContainer.querySelector(".error");
  if (!span) {
    span = document.createElement("span");
    span.classList.add("error");
    span.style.color = "red";
    span.style.fontSize = "12px";
    span.style.marginTop = "4px";
    radioContainer.appendChild(span);
  }

  span.innerHTML = message;
  span.style.display = "block";
}

function clearGenderError() {
  const radioContainer = document.querySelector(".radio-container");
  if (!radioContainer) return;

  const span = radioContainer.querySelector(".error");
  if (span) {
    span.innerHTML = "";
    span.style.display = "none";
  }
}

const passwordIcons = document.querySelectorAll(".password-icon");

passwordIcons.forEach((icon) => {
  icon.addEventListener("click", function () {
    const input = this.parentElement.querySelector("input");
    if (!input) return;

    input.type = input.type === "password" ? "text" : "password";
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });
});

// TELA DE RECUPERAÇÃO DE SENHA
document
  .querySelector(".btn-enviar-link")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const inputEmail = document.querySelector("#email_recuperacao");
    const msg = document.querySelector(".msg-link-enviado");
    const inputField = inputEmail.closest(".input-field");

    const emailDigitado = inputEmail.value.trim();
    const usuarioCadastrado = localStorage.getItem("usuario");

    // RESET VISUAL
    msg.style.display = "none";
    msg.textContent = "";
    inputField.style.border = "1px solid rgb(168, 166, 166)";

    if (!usuarioCadastrado) {
      msg.textContent = "Não existe conta com esse e-mail.";
      msg.style.color = "red";
      msg.style.display = "block";
      inputField.style.border = "2px solid red";
      return;
    }

    const usuario = JSON.parse(usuarioCadastrado);

    if (emailDigitado !== usuario.email) {
      msg.textContent = "O e-mail informado está incorreto.";
      msg.style.color = "red";
      msg.style.display = "block";
      inputField.style.border = "2px solid red";
      return;
    }

    // SUCESSO
    msg.textContent = "Link Enviado! Verifique sua caixa de E-mail!";
    msg.style.color = "green";
    msg.style.display = "block";
    inputField.style.border = "2px solid green";
  });
