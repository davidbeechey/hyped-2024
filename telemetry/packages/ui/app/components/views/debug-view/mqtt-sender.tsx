import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMQTT } from '@/context/mqtt';
import toast from 'react-hot-toast';
import { log } from '@/lib/logger';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Radio, Send } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCurrentPod, usePods } from '@/context/pods';
import { QoS } from '@/types/mqtt';
import { useKeyPress } from '@/hooks/useKeyPress';

const mqttMessageSchema = z.object({  
  topic: z.string().min(1, {
    message: 'Topic must not be empty',
  }),
  message: z.string(),
  qos: z.coerce
    .number()
    .optional()
    .refine((val) => (val ? [0, 1, 2].includes(val) : true), {
      message: 'QoS must be 0, 1, or 2',
    }),
  retain: z.coerce.boolean().optional(),
});

type MqttMessageSchema = z.infer<typeof mqttMessageSchema>;

/**
 * Custom MQTT message sender to allow sending of arbitrary MQTT messages.
 * @returns The MQTT sender
 */
export const MqttSender = () => {
  const { customPublish: publish } = useMQTT();
  const { currentPod: podId } = useCurrentPod();

  useKeyPress([['ctrlKey', 'Enter']], () => {
    form.handleSubmit(onSubmit)();
  });

  const defaultMqttMessage: MqttMessageSchema = {
    topic: `hyped/${podId}/`,
    message: '',
    qos: 0,
    retain: false,
  };

  const form = useForm<MqttMessageSchema>({
    // @ts-ignore - not sure why this is throwing an error
    resolver: zodResolver(mqttMessageSchema),
    defaultValues: defaultMqttMessage,
  });

  function onSubmit(values: MqttMessageSchema) {
    if (!publish) {
      toast.error('Could not publish message.');
      return;
    }
    publish(values.topic, values.message, {
      qos: values.qos as QoS,
      retain: values.retain,
    });
    log(`Published message to ${values.topic}: ${values.message}`);
    // Reset message field
    form.setValue('message', '');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="border-none">
          <CardHeader>
            <CardTitle className="flex gap-2">
              <Radio /> MQTT
            </CardTitle>
            <CardDescription>Send arbitrary MQTT messages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem className="flex gap-4 items-center">
                  <FormLabel>Topic:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message:</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-between gap-4">
              <FormField
                control={form.control}
                name="qos"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center text-sm space-y-0">
                    <FormLabel>QoS:</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">0 (At most once)</SelectItem>
                        <SelectItem value="1">1 (At least once)</SelectItem>
                        <SelectItem value="2">2 (Exactly once)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="retain"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center text-sm space-y-0">
                    <FormLabel>Retain:</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">true</SelectItem>
                        <SelectItem value="false">false</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="flex gap-2">
                Send <Send size={16} />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
