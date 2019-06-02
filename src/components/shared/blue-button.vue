<template>
  <router-link
    v-if="typeof (onClick) === 'undefined'"
    :to="url"
    class="white--text btn-create-assessment"
    :class="className"
  >
    {{ text }}
  </router-link>
  <router-link
    v-else
    to="#"
    class="white--text btn-create-assessment"
    :class="className"
    @click.native="onClick"
  >
    {{ text }}
  </router-link>
</template>

<script>
export default {
  name: 'BlueButton',
  props: {
    url: String,
    text: String,
    className: String,
    onClick: Function
  }
}
</script>

<style lang="scss">
@import '../../styles/_variables.scss';

.btn-create-assessment {
  display: inline-block;
  width: 100%;
  padding: 15px;
  border-radius: 5px;
  text-align: center;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  background-color: $light-blue;
}

@media (max-width: 768px) {
  font-size: 18px;
}
</style>