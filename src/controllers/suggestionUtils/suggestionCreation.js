const { ComponentMeta, Suggestion } = require('../../models');

const makeExampleSuggestions = async ( t ) => {
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
        const suggestion1 = await Suggestion.create({
            suggestionText: ' Nulla risus purus, lacinia ac volutpat ac, fringilla quis lorem. Morbi in porttitor dolor. Nunc blandit mauris facilisis, feugiat purus at, sollicitudin urna. Sed egestas enim tortor, eu placerat leo bibendum quis. Fusce tempus risus vel eleifend malesuada. In tincidunt lorem eu ex congue blandit. Suspendisse sollicitudin ac massa vel tincidunt. Suspendisse cursus non nibh eu gravida. Suspendisse potenti. Integer elementum nibh pulvinar diam efficitur, eget feugiat metus fermentum. ',
            suggestionCondition: null,
            suggestionSecondarySubject: null,
            priority: 0
        }, {transaction: t});
        const suggestion2 = await Suggestion.create({
            suggestionText: ' Ut porttitor non diam vel consectetur. Aliquam facilisis nisl vitae fermentum volutpat. Quisque varius sapien et tortor pellentesque placerat. Mauris a pharetra neque. Etiam efficitur purus feugiat iaculis consequat. Integer eu tristique orci. Nunc dapibus luctus mi, at placerat augue lacinia sit amet. Praesent eu commodo velit. Nunc vulputate metus at diam fringilla congue. Vivamus sagittis suscipit ligula, id interdum tellus cursus ac. Nam vel fringilla ex. Sed ac tellus eu est facilisis condimentum non nec enim. Nulla metus metus, lobortis eget varius molestie, tempor sed sem. Nulla sodales sem ultricies imperdiet imperdiet. ',
            suggestionCondition: null,
            suggestionSecondarySubject: 'Secondary subject',
            priority: 5
        }, {transaction: t});
        const suggestion3 = await Suggestion.create({
            suggestionText: ' Aenean in egestas diam. Sed tempor ex id bibendum volutpat. Suspendisse accumsan vel erat vel fermentum. Fusce molestie in lorem eget cursus. Aliquam a congue risus, at ornare erat. Fusce quam nulla, posuere quis porta ac, mollis eget nisi. Donec maximus vehicula risus, eu egestas odio aliquam quis. Pellentesque rhoncus, sapien ac ultrices pretium, enim erat euismod leo, nec eleifend nisi ligula quis mauris. Maecenas sollicitudin dolor in velit euismod ultricies at a elit. Pellentesque dictum libero tempor dignissim luctus. ',
            suggestionCondition: null,
            suggestionSecondarySubject: null,
            priority: 40
        }, {transaction: t});
        const suggestion4 = await Suggestion.create({
            suggestionText: ' Cras nec purus mi. Donec eu egestas arcu. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium mauris est, et commodo nunc ornare tempor. Maecenas eros risus, laoreet sit amet metus quis, lobortis hendrerit elit. Fusce tincidunt metus eu cursus feugiat. Duis vitae porttitor ipsum. Duis dolor est, laoreet eget varius ut, commodo eu urna. ',
            suggestionCondition: null,
            suggestionSecondarySubject: 'Secondary subject',
            priority: 80
        }, {transaction: t});
        await suggestion1.setSubject(subject, {transaction: t});
        await suggestion2.setSubject(subject, {transaction: t});
        await suggestion3.setSubject(subject, {transaction: t});
        await suggestion4.setSubject(subject, {transaction: t});
        console.log(suggestion1.toJSON());
        console.log(suggestion2.toJSON());
        console.log(suggestion3.toJSON());
        console.log(suggestion4.toJSON());
    };
}

module.exports = {
    makeExampleSuggestions
}