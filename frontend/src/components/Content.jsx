/* eslint-disable react/prop-types */
export default function Content(props) {
    const contentList = props.content.split(".").filter((content) => content.trim() !== "");
    return (
        <div className="content">
                <h1>{props.title}</h1>
                <ul>
                    {contentList.map((content, index) => <li key={index}>{content}</li>)}
                </ul>
            </div>
    )
}