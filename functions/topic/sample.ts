
export const onRequest: PagesFunction = async () => {
    return new Response(JSON.stringify([
        {
            icon: 'thermometer',
            name: 'Temperature',
            value: '22.5C',
        },
        {
            icon: 'water',
            name: 'Humidity',
            value: '50%',
        },
        {
            icon: 'pin',
            name: 'Pressure',
            value: '1013mBar',
        },
    ]
    ))
}

