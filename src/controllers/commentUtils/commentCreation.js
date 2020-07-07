const { ComponentMeta, Comment } = require('../../models');

const makeExampleComments = async ( t ) => {
    const allSubjects = await ComponentMeta.findAll({
        where: {
            'hasSuggestions': 'true'
        },
        attributes: ['subject', 'idMeta']
    },
    {
        transaction: t
    });

    for (const subject of allSubjects) {
        console.log(subject.toJSON());
        const comment1 = await Comment.create({
            commentText: 'Aenean ut interdum nisl, vitae laoreet elit. Fusce tincidunt erat lectus, id dignissim mauris tempus sit amet. Nulla iaculis mauris sed arcu pretium, nec porta tortor convallis.',
            commentAuthor: '',
            commentAuthorSub: 'exampleauthor',
            commentSentiment: 'negative',
            commentSecondarySubject: null,
            commentAnonymity: true
        }, {transaction: t});
        const comment2 = await Comment.create({
            commentText: 'Phasellus eu elit et orci pulvinar mattis sit amet a est. Proin aliquet ultrices ipsum vitae consequat. Proin eu odio ut lacus gravida rutrum. Mauris eget sapien est. Etiam ut libero ante.',
            commentAuthor: 'John Doe',
            commentAuthorSub: 'exampleauthor',
            commentSentiment: 'positive',
            commentSecondarySubject: 'Secondary subject',
            commentAnonymity: false
        }, {transaction: t});
        const comment3 = await Comment.create({
            commentText: 'Aliquam posuere porttitor lacus quis feugiat. Phasellus finibus volutpat nisi, eget rhoncus neque rhoncus non. Pellentesque porttitor quam mauris, et faucibus diam porta eget.',
            commentAuthor: 'elli.esimerkki@gmail.com',
            commentAuthorSub: 'exampleauthor',
            commentSentiment: null,
            commentSecondarySubject: null,
            commentAnonymity: false
        }, {transaction: t});
        const comment4 = await Comment.create({
            commentText: 'Praesent nec ante tortor. In lobortis ligula facilisis pulvinar venenatis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec iaculis justo est, sit amet elementum nibh volutpat et.',
            commentAuthor: 'Jane Doe',
            commentAuthorSub: 'exampleauthor',
            commentSentiment: 'neutral',
            commentSecondarySubject: 'Secondary subject',
            commentAnonymity: false
        }, {transaction: t});
        await comment1.setSubject(subject, {transaction: t});
        await comment2.setSubject(subject, {transaction: t});
        await comment3.setSubject(subject, {transaction: t});
        await comment4.setSubject(subject, {transaction: t});
        console.log(comment1.toJSON());
        console.log(comment2.toJSON());
        console.log(comment3.toJSON());
        console.log(comment4.toJSON());
    }
}

module.exports = {
    makeExampleComments
}