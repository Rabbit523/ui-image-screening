import router from '@/./router'

class Errors {
  constructor () {
    this.errors = {}
  }
  has (field) {
    if ('errors' in this.errors) {
      return this.errors['errors'][0].hasOwnProperty(field)
    }
  }
  any () {
    if ('errors' in this.errors) {
      return Object.keys(this.errors['error'][0]).length > 0
    } else {
      return false
    }
  }
  get (field) {
    if ('errors' in this.errors) {
      if (field in this.errors['errors'][0]) {
        return this.errors['errors'][0][field]
      } else {
        return ''
      }
    } else {
      return ''
    }
  }
  getAll () {
    if ('errors' in this.errors) {
      return this.errors['errors'][0]
    } else {
      return null
    }
  }
  record (error) {
    this.errors = error
  }
  clear (field) {
    if (field) {
      if ('errors' in this.errors) {
        delete this.errors['error'][0][field]
      }
    } else {
      this.errors = {}
    }
  }
  action () {
    if (this.get('status') === '401') {
      switch (this.get('detail')) {
        case 'Signature has expired.':
          window.store.dispatch('refreshToken')
          break
        case 'Error decoding signature.':
          router.push({ name: 'signin' })
          break
        default:
          router.push('/signin')
      }
    } else {
      return false
    }
  }
}
export default Errors
