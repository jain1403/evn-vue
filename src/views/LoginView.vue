<template>
  <div class="evn-catalog-login">
    <!--TODO: can we eliminate the 'login-modal' div container?-->
    <div class="login-modal">
      <form class="login-form" @submit.prevent="handleSubmit">
        <input id="login-username-input"
               class="text-input input--regular"
               :class="{'validation-error': hasFormError}"
               v-model="username"
               placeholder="Username"
               @input="handleInputChange"/>

        <input id="login-pwd-input"
               class="text-input input--regular"
               :class="{'validation-error': hasFormError}"
               v-model="password"
               placeholder="Password"
               type="password"
               @input="handleInputChange"/>

        <input id="login-button"
               class="btn btn--primary"
               type="submit"
               value="Login">
      </form>
    </div>

    <modal-overlay></modal-overlay>
  </div>
</template>

<script>
  import ModalOverlay from '../components/misc/ModalOverlay.vue'

  import { authDomain, hasCredentials } from '../js/auth'

  const util = require('util')

  export default {
    name: 'evn-catalog-login',
    components: {
      ModalOverlay,
      'modal-overlay': ModalOverlay
    },
    data () {
      return {
        'username': '',
        'password': '',
        'hasFormError': false
      }
    },
    methods: {
      async handleSubmit () {
        const queryParams = {
          username: this.username,
          passtoken: new Buffer(this.password).toString('base64')
        }

        // send request to login with input user credentials
        try {
          let response = await fetch(new Request(
            util.format('%s/login?username=%s&passtoken=%s', authDomain, queryParams.username, queryParams.passtoken)))
          if (response.status !== 200) {
            throw new Error('Credentials failed validation with status : ' + response.status)
          }

          // store user info and tokens in local storage
          let body = await response.json()
          // TODO: perform validation here that user details has name and tokens
          localStorage.setItem('userDetails', JSON.stringify(body))

          // emit event to main Vue component which will handle rendering the
          // Catalog view with user's info (name) displayed
          this.$emit('userAuthenticated')
          this.$router.push({path: '/catalog'})
        } catch (e) {
          console.error('Error during validation :\n' + e)
          this.hasFormError = true
          localStorage.clear()
        }
      },
      handleInputChange () {
        // toggle variable tied to visual style for form error
        this.hasFormError = this.hasFormError ? false : this.hasFormError
      }
    },
    beforeMount: function () {
      // if user already has some auth info, redirect to index which will then determine if auth info is valid
      if (hasCredentials(localStorage)) {
        this.$router.push({path: '/catalog'})
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../static/bower_components/px-buttons-design/objects.buttons";

  $inuit-enable-input--regular : true;
  $inuit-enable-validation-states : true;
  $inuit-forms-color : $gray4;
  $inuit-forms-color--placeholder : $gray8;
  $inuit-forms-background--hover : $gray12;
  @import "../../static/bower_components/px-forms-design/base.forms";

  .evn-catalog-login {
    height: calc(100% - 80px);

    display: flex;
    justify-content: center;

    .login-modal {
      background-color: $gray15;

      width: 30%;
      /*height: 30%;*/

      position: absolute;
      z-index: 101;

      align-self: center;

      display: flex;
      flex-direction: row;
      justify-content: center;

      * {
        margin: 2%;
      }

      .login-form {
        .text-input {
          /*padding: 0;*/
        }

        #login-button {
          margin-left: 2%;
        }
      }
    }
  }
</style>
