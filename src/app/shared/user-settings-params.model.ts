import { VisibleOptionsItems } from './visible-options-items.model';
export interface IUserSettingsParams {
    [key: string]: string|number|boolean|null|IUserSettingsParams|VisibleOptionsItems[];
}
