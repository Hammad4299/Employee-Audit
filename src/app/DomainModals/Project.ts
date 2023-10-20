export interface Project {
  id: number;
  name: string;
  billable?: boolean;
  aliases?: string[];
}
export default Project;
