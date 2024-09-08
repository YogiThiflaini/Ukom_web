<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ApprovalStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public $statusMessage;

    /**
     * Create a new message instance.
     *
     * @param string $statusMessage
     * @return void
     */
    public function __construct($statusMessage)
    {
        $this->statusMessage = $statusMessage;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.approval_status')
                    ->with([
                        'statusMessage' => $this->statusMessage,
                    ]);
    }
}
