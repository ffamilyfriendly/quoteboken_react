export type Colour = "primary" | "secondary" | "danger"

type Style = {
    readonly [key: string]: string;
}

export function SafeStyle(style: Style, property: string|null|undefined): string {
    if(!property || !(property in style)) return ""
    else return style[property]
}

export class SafeStyleInstance {
    style: Style

    constructor(style: Style) {
        this.style = style
    }

    get(property: string|null|undefined, prefix?: string) {
        return SafeStyle(this.style, `${prefix ? prefix + "-" : ""}${property}`)
    }
}

export function timeDifference(current: number, previous: number) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}