<template>
  <div class="card tickets">
    <div class="card-image">
      <figure class="image is-4by3">
        <img v-bind:src="tick.image" alt="Placeholder image" />
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-6">{{tick.nameTicket}}</p>
          <p class="subtitle is-6">{{tick.creator}}</p>
        </div>
      </div>

      <div class="content">
        <div class="subtitle is-6">{{tick.description}}</div>
        <div class="title is-7">{{tick.city}}</div>
        <time>{{this.timeConverter(tick.date)}}</time>
        <div class="title is-5">Tickets Disponibles : {{tick.totalTickets - tick.soldTickets}}</div>
        <br>
        <button @click="editTicket(tick)" v-if="tick.creator == user.email"  class="button is-success" style="float:left">Editar</button>
        <button @click="purchase(tick)" class="button is-info" style="float:right">Comprar Tickets</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ItemsTickets",
  props: ["tick","user"],
  methods: {
    timeConverter: function (timestamp) {
      return new Date(timestamp).toLocaleString();
    },
    editTicket: function (ticket) {
      this.$parent.editTicket(ticket);
    },
    purchase: function (sale) {
      this.$parent.purchase(sale);
    }
  },
};
</script>

<style>
.title.is-6 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card.tickets{
  margin: 10px;
  max-width: 23%;
  padding-bottom: 10px;
}
.subtitle.is-6{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: gray;
}
</style>