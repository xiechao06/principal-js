const { principal, permission, Principal, Permission } = require('../')

describe('principal', function () {
  it('toJson and fromJson', () => {
    principal
      .addAction('edit')
      .addAction('create')
      .addObject('blog')
      .addDecoration('in3Days')
      .setScope('create.blog')

    /* eslint-disable no-unused-expressions */
    principal.can('edit.blog').should.be.false

    let [create] = principal.getActions('create')

    permission(
      create.blog.in3Days,
      create.blog
    ).can().should.be.true

    let principal2 = new Principal()
      .fromJson(principal.toJson())
    principal2.can('edit.blog').should.be.false
    new Permission(principal2, 'create.blog.in3Days')
      .can().should.be.true
  })

  it('assureNeed', () => {
    let principal = new Principal()
      .addAction('edit')
      .addObject('blog')
      .addDecoration('in3Days')

    let need = principal.assureNeed('edit.blog.in3Days')
    need.toString().should.equal('edit.blog.in3Days')
    need = principal.assureNeed({
      action: 'edit',
      object: 'blog',
      decorations: ['in3Days']
    })
    need.toString().should.equal('edit.blog.in3Days')
  })

  it('hasBiggerNeedsThan', () => {
    let principal = new Principal()
      .addAction('edit')
      .addAction('create')
      .addObject('blog')
      .addDecoration('in3Days')
      .setScope('create.blog')

    principal.hasBiggerNeedsThan('edit.blog').should.be.false
    principal.hasBiggerNeedsThan('create.blog').should.be.false
    principal.setScope(it => it.concat('create.blog.in3Days'))
    principal.hasBiggerNeedsThan('create.blog').should.be.false
    principal.hasBiggerNeedsThan('create.blog.in3Days').should.be.true
    principal.hasBiggerNeedsThan('edit.blog.in3Days').should.be.false
  })
})
