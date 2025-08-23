export default async function EventPage(props: {
    params: Promise<{ 
        eventId: string 
    }>
}) {
    const params = await props.params;
    return (
        <div>
            <p>Event Page {params.eventId}</p>
        </div>
    )
}