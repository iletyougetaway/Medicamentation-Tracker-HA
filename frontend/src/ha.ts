export interface HomeAssistant {
  language: string;
  callWS<T>(message: Record<string, unknown>): Promise<T>;
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
  ): Promise<void>;
  connection: {
    subscribeEvents(
      callback: () => void,
      eventType: string,
    ): Promise<() => void>;
  };
}

export interface LovelaceCardConfig {
  type: string;
  config_entry_id?: string;
  title?: string;
}

