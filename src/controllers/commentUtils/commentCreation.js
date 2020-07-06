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
        const comment1 = Comment.create({
            commentText: '',
            
        })
    }
}

module.exports = {
    makeExampleComments
}