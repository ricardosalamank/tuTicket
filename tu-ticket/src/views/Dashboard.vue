<template>
  <div id="app">
    <section class="section">
      <div class="container">
        <button
          class="button is-primary"
          @click="openModal"
          style="margin-bottom: 10px"
        >+ Nuevo Evento</button>

        <div class="modal" v-bind:class="{'is-active': modalActive}">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">{{ title }}</p>
              <button class="delete" @click="closeModal()" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
              <div class="column is-6 is-offset-3">
                <form @submit.prevent="addEvent">
                  <div class="field">
                    <input
                      type="text"
                      class="input is-primary"
                      v-model="newEvent.nameTicket"
                      placeholder="Nombre Evento"
                    />
                  </div>
                  <div class="field">
                    <div class="control">
                      <div class="select is-primary">
                        <select v-model="newEvent.city">
                          <option value disabled selected>selecciona una ciudad</option>
                          <option
                            v-for="(element, index) in citys"
                            :key="index"
                            v-bind:value="element"
                          >{{ element }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="field">
                    <input
                      type="text"
                      class="input is-primary"
                      v-model="newEvent.address"
                      placeholder="Dirección"
                    />
                  </div>
                  <div class="field">
                    <datetime
                      type="datetime"
                      class="input is-primary"
                      v-model="newEvent.date"
                      placeholder="Fecha del evento"
                    ></datetime>
                  </div>
                  <div class="field">
                    <div class="control">
                      <textarea
                        class="textarea is-primary"
                        v-model="newEvent.description"
                        placeholder="Descripción"
                      ></textarea>
                    </div>
                  </div>
                  <div class="field">
                    <input
                      type="text"
                      class="input is-primary"
                      v-model="newEvent.image"
                      placeholder="URL IMAGEN"
                    />
                  </div>
                  <div class="field">
                    <input
                      type="number"
                      class="input is-primary"
                      v-model="newEvent.totalTickets"
                      placeholder="Numero De Tickets"
                    />
                  </div>
                </form>
              </div>
              <div class="notification is-danger mt-10" v-if="error">{{ error }}</div>
            </section>
            <footer class="modal-card-foot">
              <button class="button is-success" @click="addEvent">Guardar</button>
              <button class="button" @click="closeModal()">Salir</button>
            </footer>
          </div>
        </div>

        <div class="modal" v-bind:class="{'is-active': modalActiveSale}">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Comprar Tickets</p>
              <button class="delete" @click="closeModal()" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
              <div class="card">
                <div class="card-image">
                  <figure class="image is-4by3">
                    <img v-bind:src="newSale.image" alt="Placeholder image" />
                  </figure>
                </div>
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <p class="title is-6">{{newSale.nameTicket}}</p>
                      <p class="subtitle is-6">{{newSale.creator}}</p>
                    </div>
                  </div>

                  <div class="content">
                    <div class="subtitle is-5">{{newSale.description}}</div>
                    <div class="title is-7">{{newSale.city}}</div>
                    <time>{{this.timeConverter(newSale.date)}}</time>
                    <div
                      class="title is-5"
                    >Tickets Disponibles : {{newSale.totalTickets - newSale.soldTickets}}</div>

                    <NumberInputSpinner
                      v-model="ticketSale"
                      :min="0"
                      :max="newSale.totalTickets - newSale.soldTickets"
                      :integerOnly="true"
                    />
                  </div>
                </div>
              </div>
              <div class="notification is-danger mt-10" v-if="error">{{ error }}</div>
            </section>
            <footer class="modal-card-foot">
              <button class="button is-success" @click="saleTicket">Comprar</button>
              <button class="button" @click="closeModal()">Salir</button>
            </footer>
          </div>
        </div>

        <div class="columns principal" v-for="tic in countTickets" v-bind:key="tic">
          <list-tickets
            v-for="(ticket, indice) in range(tickets,tic)"
            :key="indice"
            :user = user
            :tick="ticket"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ItemsTickets from "../components/ItemsTickets";
import db from "@/config/fire";
import request from "request-promise-native";
import { Datetime } from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";
import firebase from "firebase";
import NumberInputSpinner from "vue-number-input-spinner";

export default {
  name: "App",
  data: function () {
    let user = firebase.auth().currentUser;
    return {
      tickets: [],
      countTickets: 0,
      ticketSale: 0,
      modalActive: false,
      modalActiveSale: false,
      citys: [],
      user: user,
      newEvent: {
        id: "new",
        address: "",
        city: "",
        creator: user.email,
        date: "",
        description: "",
        image: "https://bulma.io/images/placeholders/1280x960.png",
        nameTicket: "",
        soldTickets: 0,
        totalTickets: "",
        dateCreate: new Date(),
      },
      newSale: {},
      error: "",
      title: "Nuevo Evento",
    };
  },
  mounted() {
    db.collection("tickets").onSnapshot((querySnapshot) => {
      this.tickets = [];
      querySnapshot.forEach((chat) => {
        let data = chat.data();
        data.id = chat.id;
        data.date = data.date.toDate().toISOString();
        if((data.totalTickets - data.soldTickets)>0){
          this.tickets.push(data);
        }  
      });
      this.countTickets = Math.ceil(this.tickets.length / 4);
      this.tickets = this.tickets.sort((a, b) => b.dateCreate - a.dateCreate);
    });
    this.appendInitial();
  },
  components: {
    "list-tickets": ItemsTickets,
    datetime: Datetime,
    NumberInputSpinner,
  },
  methods: {
    saleTicket: function () {
      if (this.ticketSale < 1) {
        alert("Por Favor Selecciona Cuantos Tickets Vas A Comprar");
        return;
      }
      let textFinal = this.ticketSale < 2 ? "ticket" : "tickets";
      let text =
        "Vas Adquirir " +
        this.ticketSale +
        " " +
        textFinal +
        ". Esto sera descontado de tu cuenta ¿Estas Seguro?";
      if (confirm(text)) {
        let docRef = db.collection("user-tickets").doc(this.user.email);
        let docRefTickets = db.collection("tickets").doc(this.newSale.id);
        let email = this.user.email;
        let userSale = this.user.displayName;
        let idTicket = this.newSale.id;
        let ticketSale = this.ticketSale;
        docRef
          .get()
          .then(function (doc) {
            if (doc.exists) {
              let totalEnd = doc
                .data()
                .events.filter((x) => x.event == idTicket);
              if (totalEnd.length) {
                docRef.set(
                  {
                    user: email,
                    userName: userSale,
                    events: [
                      {
                        event: idTicket,
                        totalTickets: ticketSale + totalEnd[0].totalTickets,
                      },
                    ],
                  },
                  { merge: true }
                );
              } else {
                let newEvent = {
                  event: idTicket,
                  totalTickets: ticketSale,
                };
                docRef.update({
                  events: firebase.firestore.FieldValue.arrayUnion(newEvent),
                });
              }
            } else {
              docRef.set(
                {
                  user: email,
                  userName: userSale,
                  events: [
                    {
                      event: idTicket,
                      totalTickets: ticketSale,
                    },
                  ],
                },
                { merge: true }
              );
            }
          })
          .catch(function (error) {
            console.log("Error-->>", error);
          });

        docRefTickets
          .get()
          .then(function (doc) {
            docRefTickets.update({
              soldTickets: ticketSale + doc.data().soldTickets,
            });
          })
          .catch(function (error) {
            console.log("Error-->>", error);
          });
      }
      this.closeModal();
    },
    purchase: function (sale) {
      this.newSale = sale;
      this.modalActiveSale = true;
    },
    range: function (tickets, indice) {
      let start = (indice - 1) * 4;
      let end = indice * 4;
      return tickets.slice(start, end);
    },
    openModal: function () {
      this.modalActive = true;
    },
    closeModal: function () {
      this.modalActive = false;
      this.modalActiveSale = false;
      this.error = "";
    },
    editTicket: function (ticket) {
      this.title = "Edita Evento: " + ticket.nameTicket;
      this.newEvent = ticket;
      this.openModal();
    },
    addEvent: function () {
      for (var key in this.newEvent) {
        if (key != "soldTickets") {
          if (this.newEvent[key] == null || this.newEvent[key] == "") {
            this.error = " Por Favor el campo " + key + " No Puede Estar Vacio";
            return false;
          }
        }
      }
      this.newEvent.date = new Date(this.newEvent.date);
      if (this.newEvent.id == "new") {
        db.collection("tickets")
          .add(this.newEvent)
          .catch(function (error) {
            this.error = error;
          });
      } else {
        db.collection("tickets")
          .doc(this.newEvent.id)
          .set(this.newEvent)
          .catch(function (error) {
            this.error = error;
          });
      }

      this.error = "";
      this.title = "Add a New User";
      this.newEvent = {
        id: "new",
        address: "",
        city: "",
        creator: this.user.email,
        date: "",
        description: "",
        image: "https://bulma.io/images/placeholders/1280x960.png",
        nameTicket: "",
        soldTickets: 0,
        totalTickets: "",
        dateCreate: new Date(),
      };
      this.modalActive = false;
    },
    timeConverter: function (timestamp) {
      return new Date(timestamp).toLocaleString();
    },
    async appendInitial() {
      let options = {
        uri: `https://restcountries.eu/rest/v2/all?fields=name;capital`,
        method: "GET",
        json: true,
      };
      try {
        let result;
        result = await request(options);
        this.citys = result
          .map((x) => x.capital)
          .filter(function (el) {
            return el != "";
          })
          .sort();
      } catch (e) {
        this.error = e;
        return;
      }
    },
  },
};
</script>

<style>
.image.is-4by3 {
  padding-top: 45%;
}
.section {
  padding: 1rem 1.5rem;
}
.cla {
  text-align: center;
}
.principal {
  min-height: auto;
  box-shadow: 0 3rem 3rem -1rem rgba(10, 10, 10, 0.2);
}
@media (min-width: 100px) and (max-width: 768px) {
  .card.tickets{
  margin: 10px;
  max-width: 100%;
  padding-bottom: 30px;
}
}
</style>
