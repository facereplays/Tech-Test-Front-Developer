export class MenuItem {
  name:string; link: string; active=false; description: string;
  constructor(name: string, link: string, description: string) {
    this.name=name;this.link=link;this.description=description;
  }
}
