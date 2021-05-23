export type JSONSelector = { [key: string]: string | JSONSelector };

export type Route = {
  name: string;
  index?: number;
  selector?: JSONSelector;
};
