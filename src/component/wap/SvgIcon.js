export default {
  render: function (createElement) {
    return createElement(
      'svg',   // 标签名称
      {
        attrs: {
          'aria-hidden': true
        }
      },
      [
        createElement(
          'use',
          {
            attrs: {
              'xlink:href': `#${this.prefix}-${this.name}`,
              'fill': this.color
            }
          }
        )
      ] // 子节点数组
    )
  },
  props: {
    prefix: {
      type: String,
      default: 'icon'
    },
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: '#333'
    },
  }
}