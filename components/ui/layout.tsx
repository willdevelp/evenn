import { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
    return (
        <div className="flex flex-col w-full mx-auto p-4">
            {props.children}
        </div>
    )
}