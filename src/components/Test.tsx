

type TestType = {
    type: "INPUT",
    inputaozelprop:string
} | {
    type: "SELECT",
    options: string[],
    selecteozelprop:string
}

const Test = (props: TestType) => {
    return (
        <div>Test</div>
    )
}

export default Test